package routes

import (
	"bhetghat-server/api/handler"
	"bhetghat-server/api/middleware"

	"github.com/gofiber/fiber/v2"
)

func RegisterUserRoutes(app *fiber.App) {
	admin := app.Group("/admin")

	admin.Use(middleware.JWTAuthMiddleware())

	app.Get("/user", handler.GetAllUsersHandler)
	app.Get("/user/:id", handler.GetUserHandler)
}
