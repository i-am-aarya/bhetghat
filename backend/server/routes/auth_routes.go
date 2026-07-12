package routes

import (
	"github.com/gofiber/fiber/v2"

	"bhetghat-server/api/handler"
)

func RegisterAuthRoutes(app *fiber.App, userHandler *handler.UserHandler) {
	auth := app.Group("/auth")
	auth.Post("/login", userHandler.LoginHandler)
	auth.Post("/refresh", userHandler.RefreshHandler)
	auth.Post("/logout", userHandler.LogOutHandler)
	auth.Post("/register", userHandler.RegisterHandler)
}
