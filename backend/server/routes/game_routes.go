package routes

import (
	"bhetghat-server/api/handler"
	"bhetghat-server/api/middleware"
	"bhetghat-server/service"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

func RegisterGameRoutes(app *fiber.App, userService *service.UserService, roomService *service.RoomService, wsHandler *handler.WSHandler) {
	app.Get("/ws/:code", middleware.WSAuthMiddleware(userService, roomService), websocket.New(wsHandler.HandleGameWS))
}
