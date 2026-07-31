package server

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"bhetghat-server/api/handler"
	"bhetghat-server/config"
	"bhetghat-server/jwt"

	"bhetghat-server/repository"
	"bhetghat-server/server/routes"
	"bhetghat-server/service"
)

type Server struct {
	App *fiber.App
}

// initialize a Server struct
func NewServer() *Server {
	app := fiber.New(fiber.Config{EnablePrintRoutes: true})

	app.Use(logger.New())

	// CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:7000,http://localhost:5173",
		AllowHeaders:     "Origin, Content-Type, Accpet, Authorization",
		AllowCredentials: true,
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
	}))

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		panic("jwt secret env var not set!!!")
	}
	jwt := jwt.New(jwtSecret)

	userRepo := repository.NewMongoUserRepo(config.MongoClient.Database("bhetghat"), "users")
	refreshRepo := repository.NewRedisRefreshTokenRepo(config.RedisClient)
	userService := service.NewUserService(userRepo, *refreshRepo, jwt)
	userHandler := handler.NewUserHandler(userService)

	roomRepo := repository.NewMongoRoomRepo(config.MongoClient.Database("bhetghat"), "rooms")
	roomService := service.NewRoomService(roomRepo, userRepo)
	roomHandler := handler.NewRoomHandler(roomService)

	routes.SetupRoutes(app, userService, userHandler, roomHandler)

	return &Server{
		App: app,
	}
}
