package routes

import (
	"bhetghat-server/api/handler"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

func RegisterGameRoutes(app *fiber.App) {
	app.Use("/ws", websocket.New(handler.WSConn))
}
