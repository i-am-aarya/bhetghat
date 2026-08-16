package middleware

import (
	"bhetghat-server/models"
	"bhetghat-server/service"
	"log/slog"
	"slices"

	"github.com/gofiber/fiber/v2"
)

func WSAuthMiddleware(userService *service.UserService, roomService *service.RoomService) fiber.Handler {
	return func(c *fiber.Ctx) error {

		token := c.Query("token")
		if token == "" {
			slog.Error("token not found in ws url")
			return c.Status(fiber.StatusUnauthorized).JSON(models.ErrorResponse{Error: "missing token"})
		}

		user, err := userService.VerifyAccessToken(c.Context(), token)
		if err != nil {
			slog.Error("user couldn't be verified", "error", err)
			return c.Status(fiber.StatusUnauthorized).JSON(models.ErrorResponse{Error: "invalid or expired token"})
		}

		roomCode := c.Params("code")
		if roomCode == "" {
			slog.Error("room code not found")
			return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{Error: "invalid room code"})
		}

		room, err := roomService.GetRoomByCode(c.Context(), roomCode)
		if err != nil {
			slog.Error("room not found", "error", err)
			return c.Status(fiber.StatusNotFound).JSON(models.ErrorResponse{Error: "room not found"})
		}

		if !slices.Contains(room.Members, user.ID) {
			slog.Error("user not a member of room")
			return c.Status(fiber.StatusForbidden).JSON(models.ErrorResponse{Error: "not a member of the room"})
		}

		c.Locals("user", user)
		c.Locals("room", room)

		return c.Next()
	}
}
