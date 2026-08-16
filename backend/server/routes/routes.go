package routes

import (
	"bhetghat-server/api/handler"
	"bhetghat-server/service"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App, userService *service.UserService, userHandler *handler.UserHandler, roomHandler *handler.RoomHandler, roomService *service.RoomService, wsHandler *handler.WSHandler) {

	RegisterAuthRoutes(app, userHandler)
	RegisterHealthCheckRoutes(app)
	RegisterUserRoutes(app)
	RegisterGameRoutes(app, userService, roomService, wsHandler)
	RegisterRoomRoutes(app, roomHandler, userService)

}
