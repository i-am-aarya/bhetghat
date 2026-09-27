package routes

import (
	"bhetghat-server/api/handler"

	"github.com/gofiber/fiber/v2"
)

func RegisterUserRoutes(app *fiber.App, userHandler *handler.UserHandler) {
	app.Patch("/users/:id", userHandler.UpdateUserHandler)
}
