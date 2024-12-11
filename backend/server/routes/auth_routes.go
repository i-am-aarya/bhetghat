package routes

import (
	"bhetghat-server/api/handler"

	"github.com/gofiber/fiber/v2"
)

func RegisterAuthRoutes(app *fiber.App, userHandler *handler.UserHandler) {
	auth := app.Group("/auth/v1")
	// uncomment this when there's RBAC (Role Based Access Control)
	// auth.Post("/register", userHandler.RegisterHandler)
	auth.Post("/login", userHandler.LoginHandler)
}
