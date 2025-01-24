package server

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"bhetghat-server/api/handler"
	db "bhetghat-server/database"
	"bhetghat-server/repository"
	"bhetghat-server/server/routes"
	"bhetghat-server/service"
)

type Server struct {
	App *fiber.App
}

// initialize a Server struct
func NewServer() *Server {
	app := fiber.New()

	app.Use(logger.New())

	// CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "*",
	}))

	// app.Use(cors.New())

	userRepo := repository.NewMongoUserRepo(db.MongoClient.Database("bhetghat"), "users")
	userService := service.NewUserService(userRepo)
	userHandler := handler.NewUserHandler(userService)

	routes.SetupRoutes(app, userHandler)

	return &Server{
		App: app,
	}
}
