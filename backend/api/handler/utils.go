package handler

import (
	"bhetghat-server/models"
	"bhetghat-server/service"
	"errors"
	"log/slog"

	"github.com/gofiber/fiber/v2"
)

func respondError(c *fiber.Ctx, err error, code int, errMsg string) error {
	switch {

	case errors.Is(err, service.ErrRoomNotFound):
		return c.Status(fiber.StatusNotFound).JSON(models.ErrorResponse{Error: err.Error()})

	case errors.Is(err, service.ErrRoomFull):
		return c.Status(fiber.StatusConflict).JSON(models.ErrorResponse{Error: err.Error()})

	case errors.Is(err, service.ErrAlreadyMember):
		return c.Status(fiber.StatusConflict).JSON(models.ErrorResponse{Error: err.Error()})

	case errors.Is(err, service.ErrInvalidRoomPassword):
		return c.Status(fiber.StatusUnauthorized).JSON(models.ErrorResponse{Error: err.Error()})

	case errors.Is(err, service.ErrInvalidRoomID):
		return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{Error: err.Error()})

	case errors.Is(err, service.ErrInvalidParams):
		return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{Error: err.Error()})

	case errors.Is(err, service.ErrNameTooShort):
		return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{Error: err.Error()})

	case errors.Is(err, service.ErrUnauthorized):
		return c.Status(fiber.StatusUnauthorized).JSON(models.ErrorResponse{Error: err.Error()})

	case errors.Is(err, service.ErrUsernameUnavailable):
		return c.Status(fiber.StatusConflict).JSON(models.ErrorResponse{Error: err.Error()})

	case errors.Is(err, service.ErrEmailUnavailable):
		return c.Status(fiber.StatusConflict).JSON(models.ErrorResponse{Error: err.Error()})

	case errors.Is(err, service.ErrInvalidLoginParams):
		return c.Status(fiber.StatusUnauthorized).JSON(models.ErrorResponse{Error: err.Error()})

	default:
		slog.Error("request failed", "err", err)
		return c.Status(code).JSON(models.ErrorResponse{Error: errMsg})
	}
}
