package routes

import (
	"github.com/gofiber/fiber/v2"

	"bhetghat-server/api/handler"
)

func RegisterAuthRoutes(app *fiber.App, userHandler *handler.UserHandler) {
	auth := app.Group("/auth/v1")
	auth.Post("/login", userHandler.LoginHandler)
	auth.Get("/verify", userHandler.VerificationHandler)
	auth.Post("/logout", userHandler.LogOutHandler)
	auth.Post("/register", userHandler.RegisterHandler)
}
