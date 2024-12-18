package routes

import (
	"bhetghat-server/api/handler"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App, userHandler *handler.UserHandler) {

	RegisterAuthRoutes(app, userHandler)
	RegisterHealthCheckRoutes(app)
	RegisterUserRoutes(app)

	RegisterGameRoutes(app)
}
