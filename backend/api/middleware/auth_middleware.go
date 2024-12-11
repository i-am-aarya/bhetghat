package middleware

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func JWTAuthMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// validate jwt
		fmt.Println("JWT AUTH CHECK: PASS")
		return c.Next()
	}
}
