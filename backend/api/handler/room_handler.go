package handler

import (
	"bhetghat-server/models"
	"bhetghat-server/service"
	"errors"
	"log/slog"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type RoomHandler struct {
	roomService *service.RoomService
}

func NewRoomHandler(service *service.RoomService) *RoomHandler {
	return &RoomHandler{
		roomService: service,
	}
}

func (h *RoomHandler) CreateRoomHandler(c *fiber.Ctx) error {
	var params models.CreateRoomParams

	err := c.BodyParser(&params)
	if err != nil {
		slog.Error("error parsing request", "params", c.AllParams(), "error", err)
		return respondError(c, err, fiber.StatusBadRequest, "bad params")
	}

	user, ok := c.Locals("user").(*models.User)
	if !ok || user == nil {
		slog.Error("error retrieving user from context")
		return respondError(c, err, fiber.StatusUnauthorized, "unauthorized")
	}

	room, err := h.roomService.CreateRoom(c.Context(), params.Name, params.Password, user.ID)
	if err != nil {
		slog.Error("create room failed", "error", err)
		return respondError(c, err, fiber.StatusInternalServerError, "creation failed")
	}

	return c.Status(fiber.StatusCreated).JSON(models.SuccessResponse{
		Message: "created",
		Data:    room,
	})
}

func (h *RoomHandler) UpdateRoomHandler(c *fiber.Ctx) error {
	roomID, err := primitive.ObjectIDFromHex(c.Params("id"))
	if err != nil {
		slog.Error("invalid room id in update", "id", c.Params("id"), "error", err)
		return respondError(c, err, fiber.StatusBadRequest, "invalid id")
	}

	var params models.UpdateRoomParams
	if err := c.BodyParser(&params); err != nil {
		slog.Error("error parsing request", "params", params, "error", err)
		return respondError(c, err, fiber.StatusBadRequest, "invalid request params")
	}

	room, err := h.roomService.UpdateRoom(c.Context(), roomID, &params)
	if err != nil {
		slog.Error("error updating room", "error", err)
		return respondError(c, err, fiber.StatusInternalServerError, "update failed")
	}

	return c.Status(fiber.StatusOK).JSON(models.SuccessResponse{
		Message: "updated",
		Data:    room,
	})

}

func (h *RoomHandler) GetRoomsHandler(c *fiber.Ctx) error {
	rooms, err := h.roomService.GetRooms(c.Context())
	if err != nil {
		slog.Error("rooms not found")
		return respondError(c, err, fiber.StatusNotFound, "not found")
	}

	return c.JSON(models.SuccessResponse{
		Message: "data",
		Data:    rooms,
	})
}

func (h *RoomHandler) GetAllMembersHandler(c *fiber.Ctx) error {
	roomID, err := primitive.ObjectIDFromHex(c.Params("id"))
	if err != nil {
		slog.Error("error parssing object id from params", "params", c.Params("id"), "error", err)
		return respondError(c, err, fiber.StatusBadRequest, "invalid room id")
	}
	users, err := h.roomService.GetAllMembers(c.Context(), roomID)
	if err != nil {
		slog.Error("error in GetAllMembersHandler", "error", err)
		return respondError(c, err, fiber.StatusInternalServerError, "failed")
	}

	return c.JSON(models.SuccessResponse{
		Message: "success",
		Data:    users,
	})
}

func (h *RoomHandler) JoinRoomHandler(c *fiber.Ctx) error {
	code := c.Params("code")
	if code == "" {
		slog.Error("room code not found in request")
		return respondError(c, service.ErrRoomCodeNotFound, fiber.StatusBadRequest, "code not found")
	}

	user, ok := c.Locals("user").(*models.User)
	if !ok || user == nil {
		slog.Error("unauthorized join attempt")
		return respondError(c, service.ErrUnauthorized, fiber.StatusUnauthorized, "unauthorized")
	}

	room, err := h.roomService.JoinRoom(c.Context(), user.ID, code)
	if err != nil {
		slog.Error("join room failed", "roomID", code, "userID", user.ID.Hex(), "error", err)
		return respondError(c, err, fiber.StatusInternalServerError, "failed")
	}

	// room, err := h.roomService.GetRoom(c.Context(), code)
	// if err != nil {
	// 	return respondError(c, err, fiber.StatusNotFound, "not found")
	// }

	return c.JSON(models.SuccessResponse{
		Message: "joined",
		Data:    room,
	})
}

func (h *RoomHandler) LeaveRoomHandler(c *fiber.Ctx) error {
	user, ok := c.Locals("user").(*models.User)
	if !ok || user == nil {
		slog.Error("user not found in token")
		return respondError(c, service.ErrUnauthorized, fiber.StatusUnauthorized, "unauthorized")
	}

	roomID, err := primitive.ObjectIDFromHex(c.Params("id"))
	if err != nil {
		slog.Error("error getting roomID from params", "error", err)
		return respondError(c, service.ErrInvalidRoomID, fiber.StatusBadRequest, "invalid room id")
	}

	err = h.roomService.LeaveRoom(c.Context(), user.ID, roomID)
	if err != nil {
		slog.Error("error in leave room", "error", err)
		return respondError(c, err, fiber.StatusInternalServerError, "failed to leave room")
	}

	return c.JSON(models.SuccessResponse{
		Message: "left",
	})
}

func (h *RoomHandler) SearchRoomsHandler(c *fiber.Ctx) error {
	query := c.Query("q")
	if query == "" {
		slog.Error("no search query provided")
		return respondError(c, service.ErrInvalidSearchParams, fiber.StatusBadRequest, "invalid search params")
	}

	rooms, err := h.roomService.SearchRooms(c.Context(), query)
	if err != nil {
		slog.Error("SearchRooms failled", "error", err)
		return respondError(c, err, fiber.StatusNotFound, "not found")
	}

	return c.JSON(models.SuccessResponse{
		Message: "ok",
		Data:    rooms,
	})
}

func (h *RoomHandler) DeleteRoomHandler(c *fiber.Ctx) error {
	roomID, err := primitive.ObjectIDFromHex(c.Params("id"))
	if err != nil {
		slog.Error("error getting roomID from params", "error", err)
		return respondError(c, service.ErrInvalidRoomID, fiber.StatusBadRequest, "invalid room id")
	}

	user, ok := c.Locals("user").(*models.User)
	if !ok || user == nil {
		slog.Error("user not found in context")
		return respondError(c, service.ErrUnauthorized, fiber.StatusUnauthorized, "unauthorized")
	}

	if err := h.roomService.DeleteRoom(c.Context(), roomID, user.ID); err != nil {
		slog.Error("DeleteRoom failed", "error", err)
		return respondError(c, err, fiber.StatusInternalServerError, "delete failed")
	}

	return c.JSON(models.SuccessResponse{
		Message: "deleted",
	})
}

func (h *RoomHandler) FetchMyRoomsHandler(c *fiber.Ctx) error {
	user, ok := c.Locals("user").(*models.User)
	if !ok || user == nil {
		slog.Error("user not found in context")
		return respondError(c, service.ErrUnauthorized, fiber.StatusUnauthorized, "unauthorized")
	}

	rooms, err := h.roomService.GetUsersRooms(c.Context(), user.ID)
	if err != nil {
		if errors.Is(err, service.ErrRoomNotFound) {
			return c.JSON(models.SuccessResponse{
				Message: "success",
				Data:    []*models.Room{},
			})
		}
		slog.Error("error getting user's rooms", "user", user, "error", err)
		respondError(c, service.ErrRoomNotFound, fiber.StatusInternalServerError, "error")
	}

	return c.JSON(models.SuccessResponse{
		Message: "success",
		Data:    rooms,
	})
}

func (h *RoomHandler) GetRoomByCodeHandler(c *fiber.Ctx) error {
	code := c.Params("code")
	if code == "" {
		slog.Error("room code not found in request")
		return respondError(c, service.ErrRoomCodeNotFound, fiber.StatusBadRequest, "code not found")
	}

	room, err := h.roomService.GetRoomByCode(c.Context(), code)
	if err != nil {
		if errors.Is(err, service.ErrRoomNotFound) {
			return c.JSON(models.SuccessResponse{
				Message: "success",
				Data:    nil,
			})
		}
	}

	return c.JSON(models.SuccessResponse{
		Message: "success",
		Data:    room,
	})
}
