package routes

import (
	"bhetghat-server/api/handler"
	"bhetghat-server/service"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

func RegisterGameRoutes(app *fiber.App, userService *service.UserService) {
	app.Use("/ws", websocket.New(handler.WSConn))
}
