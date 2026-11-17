package controller

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
)

const (
	// Folder on disk where uploads are saved (relative to where the server runs).
	UploadDir = "./static/uploads"
	// Public URL prefix the static middleware serves UploadDir under.
	uploadURLPrefix = "/static/uploads/"
	maxUploadSize   = 5 << 20 // 5 MB
)

var allowedImageTypes = map[string]string{
	"image/jpeg": ".jpg",
	"image/png":  ".png",
	"image/gif":  ".gif",
	"image/webp": ".webp",
}

var errNoFile = errors.New("no file uploaded")

// saveUpload reads the multipart file in the given form field, checks it is an
// image of an allowed type and size, saves it to static/uploads under a random
// name, and returns its public path. It returns errNoFile if the field is empty.
func saveUpload(c fiber.Ctx, field string) (string, error) {
	file, err := c.FormFile(field)
	if err != nil || file == nil || file.Size == 0 {
		return "", errNoFile
	}

	if file.Size > maxUploadSize {
		return "", fmt.Errorf("image must be %d MB or smaller", maxUploadSize>>20)
	}

	// Detect the real type from the file's first bytes, not its name or the
	// browser-supplied header, so a renamed non-image is rejected.
	src, err := file.Open()
	if err != nil {
		return "", errors.New("could not read the uploaded file")
	}
	head := make([]byte, 512)
	n, _ := src.Read(head)
	src.Close()

	ext, ok := allowedImageTypes[http.DetectContentType(head[:n])]
	if !ok {
		return "", errors.New("image must be a JPEG, PNG, GIF or WebP file")
	}

	if err := os.MkdirAll(UploadDir, 0o755); err != nil {
		log.Println("Error creating upload folder:", err)
		return "", errors.New("could not save the image")
	}

	name, err := randomName(ext)
	if err != nil {
		return "", errors.New("could not save the image")
	}

	if err := c.SaveFile(file, filepath.Join(UploadDir, name)); err != nil {
		log.Println("Error saving upload:", err)
		return "", errors.New("could not save the image")
	}

	return uploadURLPrefix + name, nil
}

// removeUpload deletes a previously uploaded file given its public path.
// Paths outside static/uploads are ignored.
func removeUpload(publicPath string) {
	if !strings.HasPrefix(publicPath, uploadURLPrefix) {
		return
	}
	name := filepath.Base(publicPath)
	if err := os.Remove(filepath.Join(UploadDir, name)); err != nil && !os.IsNotExist(err) {
		log.Println("Error removing upload:", err)
	}
}

func randomName(ext string) (string, error) {
	b := make([]byte, 8)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return fmt.Sprintf("%d-%s%s", time.Now().Unix(), hex.EncodeToString(b), ext), nil
}
