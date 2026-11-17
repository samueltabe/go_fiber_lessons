package controller

import (
	"errors"
	"log"
	"strconv"

	"github.com/gofiber/fiber/v3"
	"github.com/samueltabe/gofiber-blog/model"
	"github.com/samueltabe/gofiber-blog/database"
	"gorm.io/gorm"
)



func BlogList(c fiber.Ctx) error {
	
	context :=fiber.Map{
		"statusText": "ok",
		"msg":        "Blog List",
	}

	db := database.DBconn
	var record []model.Blog
	db.Find(&record)
	context["data"] = record


	c.Status(200)
	return c.JSON(context)
}

func BlogCreate(c fiber.Ctx) error{

	context :=fiber.Map{
		"statusText": "ok",
		"msg":        "Add a Blog",
	}

	record := new(model.Blog)
	if err := c.Bind().Body(record); err != nil {
		log.Println("Error parsing request body:", err)
		context["statusText"] = "error"
		context["msg"] = "Failed to parse request body"
		return c.Status(400).JSON(context)
	}

	// Optional image upload (multipart field "image")
	record.Image = ""
	image, err := saveUpload(c, "image")
	if err != nil && !errors.Is(err, errNoFile) {
		context["statusText"] = "error"
		context["msg"] = err.Error()
		return c.Status(400).JSON(context)
	}
	record.Image = image

	db := database.DBconn
	if err := db.Create(record).Error; err != nil {
		removeUpload(image)
		log.Println("Error creating blog:", err)
		context["statusText"] = "error"
		context["msg"] = "Failed to create blog"
		return c.Status(500).JSON(context)
	}


	context["msg"] = "Blog created successfully"
	context["data"] = record

	c.Status(201)
	return c.JSON(context)
}

func BlogUpdate(c fiber.Ctx) error{

	context :=fiber.Map{
		"statusText": "ok",
		"msg":        "Update Blog",
	}

	id := c.Params("id")
	db := database.DBconn
	var record model.Blog
	if err := db.First(&record, id).Error; err != nil {
		log.Println("Error finding blog:", err)
		context["statusText"] = "error"
		context["msg"] = "Blog not found"
		return c.Status(404).JSON(context)
	}

	oldImage := record.Image

	if err := c.Bind().Body(&record); err != nil {
		log.Println("Error parsing request body:", err)
		context["statusText"] = "error"
		context["msg"] = "Failed to parse request body"
		return c.Status(400).JSON(context)
	}
	record.Image = oldImage // only an uploaded file may change the image

	// Optional new image: replaces the old one
	newImage, err := saveUpload(c, "image")
	if err != nil && !errors.Is(err, errNoFile) {
		context["statusText"] = "error"
		context["msg"] = err.Error()
		return c.Status(400).JSON(context)
	}
	if newImage != "" {
		record.Image = newImage
	}

	if err := db.Save(&record).Error; err != nil {
		removeUpload(newImage)
		log.Println("Error updating blog:", err)
		context["statusText"] = "error"
		context["msg"] = "Failed to update blog"
		return c.Status(500).JSON(context)
	}

	if newImage != "" {
		removeUpload(oldImage)
	}

	context["msg"] = "Blog updated successfully"
	context["data"] = record

	c.Status(200)
	return c.JSON(context)
}

func BlogDelete(c fiber.Ctx) error{

	context :=fiber.Map{
		"statusText": "ok",
		"msg":        "Delete Blog for the given ID",
	}

	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		context["statusText"] = "error"
		context["msg"] = "Invalid blog ID"
		return c.Status(400).JSON(context)
	}

	db := database.DBconn
	var record model.Blog
	if err := db.First(&record, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			context["statusText"] = "error"
			context["msg"] = "Blog not found"
			return c.Status(404).JSON(context)
		}
		log.Println("Error finding blog:", err)
		context["statusText"] = "error"
		context["msg"] = "Failed to find blog"
		return c.Status(500).JSON(context)
	}

	if err := db.Delete(&record).Error; err != nil {
		log.Println("Error deleting blog:", err)
		context["statusText"] = "error"
		context["msg"] = "Failed to delete blog"
		return c.Status(500).JSON(context)
	}
	removeUpload(record.Image)

	context["msg"] = "Blog deleted successfully"
	context["data"] = record

	return c.Status(200).JSON(context)
}

func BlogDetail(c fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "ok",
		"msg":        "Blog Detail",
	}

	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		context["statusText"] = "error"
		context["msg"] = "Invalid blog ID"
		return c.Status(400).JSON(context)
	}

	var record model.Blog
	if err := database.DBconn.First(&record, id).Error; err != nil {
		context["statusText"] = "error"
		if errors.Is(err, gorm.ErrRecordNotFound) {
			context["msg"] = "Blog not found"
			return c.Status(404).JSON(context)
		}
		log.Println("Error finding blog:", err)
		context["msg"] = "Failed to fetch blog"
		return c.Status(500).JSON(context)
	}

	context["data"] = record
	return c.Status(200).JSON(context)
}