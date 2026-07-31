package routes

import (
	"bhetghat-server/api/handler"
	"bhetghat-server/service"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App, userService *service.UserService, userHandler *handler.UserHandler, roomHandler *handler.RoomHandler) {

	RegisterAuthRoutes(app, userHandler)
	RegisterHealthCheckRoutes(app)
	RegisterUserRoutes(app)
	RegisterGameRoutes(app)
	RegisterRoomRoutes(app, roomHandler, userService)

}
