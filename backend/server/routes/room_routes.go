package routes

import (
	"bhetghat-server/api/handler"
	"bhetghat-server/api/middleware"
	"bhetghat-server/service"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoomRoutes(app *fiber.App, roomHandler *handler.RoomHandler, userService *service.UserService) {
	app.Get("/rooms", roomHandler.GetRoomsHandler)
	app.Get("/rooms/search", roomHandler.SearchRoomsHandler)

	rooms := app.Group("/rooms", middleware.JWTAuthMiddleware(userService))
	rooms.Post("/", roomHandler.CreateRoomHandler)
	rooms.Patch("/:id", roomHandler.UpdateRoomHandler)
	rooms.Delete("/:id", roomHandler.DeleteRoomHandler)
	rooms.Get("/:id/members", roomHandler.GetAllMembersHandler)
	rooms.Post("/:code/members", roomHandler.JoinRoomHandler)
	rooms.Delete("/:code/members", roomHandler.LeaveRoomHandler)
	rooms.Get("/mine", roomHandler.FetchMyRoomsHandler)
	rooms.Get("/:code", roomHandler.GetRoomByCodeHandler)
}
