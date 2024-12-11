package server

import (
	"bhetghat-server/api/handler"
	db "bhetghat-server/database"
	"bhetghat-server/repository"
	"bhetghat-server/server/routes"
	"bhetghat-server/service"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

type Server struct {
	App *fiber.App
}

// initialize a Server struct
func NewServer() *Server {
	app := fiber.New()

	app.Use(logger.New())

	userRepo := repository.NewMongoUserRepo(db.MongoClient.Database("bhetghat"), "users")
	userService := service.NewUserService(userRepo)
	userHandler := handler.NewUserHandler(userService)

	routes.SetupRoutes(app, userHandler)

	return &Server{
		App: app,
	}
}
