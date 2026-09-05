package handler

import (
	"log/slog"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"bhetghat-server/models"
	"bhetghat-server/service"
)

type UserHandler struct {
	userService *service.UserService
}

func NewUserHandler(userService *service.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

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
		slog.Error("login failed",
			"username", loginParams.Username,
			"error", err,
		)
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid username or password"})
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
		slog.Error("refreshToken not found in cookies")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
	}

	user, tokenPair, err := h.userService.RefreshTokens(c.Context(), refreshToken)
	if err != nil {
		slog.Error("error refreshing token", "error", err)
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

// user CRUD
func GetUserHandler(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"msg": "get user called"})
}

func GetAllUsersHandler(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"msg": "get all users called"})
}

func CreateUserHandler(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"msg": "create user called"})
}

func (h *UserHandler) UpdateUserHandler(c *fiber.Ctx) error {
	userIdStr := c.Params("id")
	if userIdStr == "" {
		slog.Error("userid not found in params")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "bad request"})
	}

	var updateParams models.UpdateUserParams
	if err := c.BodyParser(&updateParams); err != nil {
		slog.Error("couldn't parse update params", "error", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "bad request body"})
	}

	userID, err := primitive.ObjectIDFromHex(userIdStr)
	if err != nil {
		slog.Error("couldn't get object id from id provided in request", "error", err, "userID: ", userIdStr)
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
	}

	user, err := h.userService.UpdateUser(c.Context(), userID, &updateParams)
	if err != nil {
		slog.Error("error updating user", "error", err, "update params", updateParams)
		return respondError(c, err, fiber.StatusInternalServerError, "error updating user")
	}

	return c.JSON(fiber.Map{
		"message": "success",
		"data":    user,
	})
}

func DeleteUserHandler(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"msg": "delete called"})
}
