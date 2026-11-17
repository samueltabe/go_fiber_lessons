package main

import (
	"log"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"github.com/samueltabe/gofiber-blog/database"
	"github.com/samueltabe/gofiber-blog/router"
	"github.com/joho/godotenv"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/static"
	"github.com/samueltabe/gofiber-blog/controller"
)

func init() {
	
	if err := godotenv.Load(".env"); err !=nil{
		log.Fatal("Error loading .env file")
	}
	database.ConnectDB()
}

func main() {

	sqlDB, err := database.DBconn.DB()
	if err != nil {
		panic("Failed to get database connection: " + err.Error())
	}
	defer sqlDB.Close()

	app := fiber.New(fiber.Config{
		BodyLimit: 6 * 1024 * 1024, // room for a 5 MB image plus form fields
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept"},
	}))

	app.Use(logger.New())

	// Serve uploaded images, e.g. GET /static/uploads/<name>.jpg
	app.Get("/static/uploads*", static.New(controller.UploadDir))

	router.SetupRoutes(app)

	app.Listen(":3001")
}
