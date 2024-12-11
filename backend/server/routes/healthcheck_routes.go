package routes

import (
	"bhetghat-server/api/handler"

	"github.com/gofiber/fiber/v2"
)

func RegisterHealthCheckRoutes(app *fiber.App) {
	app.Get("/ping", handler.PingHandler)
}
