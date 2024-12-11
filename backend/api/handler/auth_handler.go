package handler

import (
	"github.com/gofiber/fiber/v2"

	"bhetghat-server/models"
)

func (h *UserHandler) RegisterHandler(c *fiber.Ctx) error {
	var registerParams models.CreateUserParams
	err := c.BodyParser(&registerParams)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "bad request"})
	}

	userFromParams, err := h.userService.CreateUser(c.Context(), &registerParams)
	if err != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": err.Error()})
	}

	if err := userFromParams.Validate(); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	userFromParams, err = h.userService.RegisterUser(c.Context(), userFromParams)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).
		JSON(fiber.Map{"msg": "registered", "userID": userFromParams.ID})
}

func (h *UserHandler) LoginHandler(c *fiber.Ctx) error {
	var loginParams models.LoginUserParams
	err := c.BodyParser(&loginParams)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "bad request"})
	}

	user, token, err := h.userService.LoginUser(c.Context(), &loginParams)
	if err != nil {
		if user == nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "unauthorized"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"token": token,
		"user":  user,
	})
}
