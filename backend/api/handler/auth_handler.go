package handler

import (
	"log"
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
		JSON(fiber.Map{"msg": "registered", "user": userFromParams})
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

	c.Cookie(&fiber.Cookie{
		Name:     "authToken",
		Value:    token,
		Path:     "/",
		HTTPOnly: true,
		Expires:  time.Now().Add(4 * time.Hour),
		SameSite: "Strict",
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"user":      user,
		"authToken": token,
	})
}

func (h *UserHandler) VerificationHandler(c *fiber.Ctx) error {
	jwtTokenString := c.Cookies("authToken")
	if jwtTokenString == "" {
		log.Println("TOKEN NOT FOUND IN COOKIES")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
	}
	log.Println("TOKEN FOUND IN COOKIES")

	user, _, err := h.userService.VerifyUser(c.Context(), jwtTokenString)
	// log.Println("JWT CLAIMS: ", claims)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"user": user,
	})
}

func (h *UserHandler) LogOutHandler(c *fiber.Ctx) error {
	// cookie := c.Cookies("authToken")
	c.Cookie(&fiber.Cookie{
		Name:   "authToken",
		Value:  "",
		Path:   "/",
		MaxAge: -1,
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"msg": "logged out"})
}
