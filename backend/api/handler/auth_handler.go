package handler

import (
	"time"

	"github.com/gofiber/fiber/v2"

	"bhetghat-server/models"
)

func (h *UserHandler) RegisterHandler(c *fiber.Ctx) error {
	var registerParams models.CreateUserParams
	err := c.BodyParser(&registerParams)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "bad request"})
	}

	if err := registerParams.Validate(); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "bad request"})
	}

	user, tokenPair, err := h.userService.RegisterUser(c.Context(), &registerParams)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "bad request"})
	}

	c.Cookie(&fiber.Cookie{
		Name:     "refreshToken",
		Value:    tokenPair.RefreshToken,
		Path:     "/auth/refresh",
		HTTPOnly: true,
		Expires:  time.Now().Add(15 * time.Minute),
		SameSite: "Strict",
	})

	return c.Status(fiber.StatusCreated).
		JSON(models.TokenResponse{
			User:        user,
			AccessToken: tokenPair.AccessToken,
		})
}

func (h *UserHandler) LoginHandler(c *fiber.Ctx) error {
	var loginParams models.LoginUserParams
	err := c.BodyParser(&loginParams)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "bad request"})
	}

	user, tokens, err := h.userService.LoginUser(c.Context(), &loginParams)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
	}

	c.Cookie(&fiber.Cookie{
		Name:     "refreshToken",
		Value:    tokens.RefreshToken,
		Path:     "/auth/refresh",
		HTTPOnly: true,
		Expires:  time.Now().Add(4 * time.Hour),
		SameSite: "Strict",
	})

	return c.Status(fiber.StatusOK).JSON(models.TokenResponse{
		User:        user,
		AccessToken: tokens.AccessToken,
	})
}

func (h *UserHandler) RefreshHandler(c *fiber.Ctx) error {
	refreshToken := c.Cookies("refreshToken")
	if refreshToken == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
	}

	user, tokenPair, err := h.userService.RefreshTokens(c.Context(), refreshToken)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
	}

	c.Cookie(&fiber.Cookie{
		Name:     "refreshToken",
		Value:    tokenPair.RefreshToken,
		Path:     "/auth/refresh",
		HTTPOnly: true,
		Expires:  time.Now().Add(4 * time.Hour),
		SameSite: "Strict",
	})

	return c.Status(fiber.StatusOK).JSON(models.TokenResponse{
		AccessToken: tokenPair.AccessToken,
		User:        user,
	})
}

func (h *UserHandler) LogOutHandler(c *fiber.Ctx) error {

	refreshToken := c.Cookies("refreshToken")

	if refreshToken != "" {
		if err := h.userService.LogoutUser(c.Context(), refreshToken); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"msg": "server error"})
		}
	}

	c.Cookie(&fiber.Cookie{
		Name:   "refreshToken",
		Value:  "",
		Path:   "/auth/refresh",
		MaxAge: -1,
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"msg": "logged out"})
}
