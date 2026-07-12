package routes

import (
	"bhetghat-server/api/handler"
	"bhetghat-server/service"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App, userHandler *handler.UserHandler, userService *service.UserService) {

	RegisterAuthRoutes(app, userHandler)
	RegisterHealthCheckRoutes(app)
	RegisterUserRoutes(app)

	RegisterGameRoutes(app, userService)
}
