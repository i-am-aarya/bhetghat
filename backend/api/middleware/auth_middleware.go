package middleware

import (
	"bhetghat-server/service"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func JWTAuthMiddleware(userService *service.UserService) fiber.Handler {
	return func(c *fiber.Ctx) error {

		authHeader := c.Get("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer ") {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "missing or malformed token"})
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		user, err := userService.VerifyAccessToken(c.Context(), tokenString)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid or expired token"})
		}

		c.Locals("user", user)
		return c.Next()
	}
}
