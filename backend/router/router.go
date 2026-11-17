package router

import (
	"github.com/gofiber/fiber/v3"
	"github.com/samueltabe/gofiber-blog/controller"
)

func SetupRoutes(app *fiber.App) {
	// blog := app.Group("/blog")
	// blog.Get("/", BlogList)
	// blog.Post("/", BlogCreate)
	// blog.Put("/:id", BlogUpdate)
	// blog.Delete("/:id", BlogDelete)

	app.Get("/", controller.BlogList)
	app.Get("/:id", controller.BlogDetail)
	app.Post("/", controller.BlogCreate)
	app.Put("/:id", controller.BlogUpdate)
	app.Delete("/:id", controller.BlogDelete)
}