package middleware

import (
	"log"

	"github.com/gofiber/fiber/v2"
)

func Logger() fiber.Handler {
	return func(c *fiber.Ctx) error {
		log.Printf("myloggger")
		return c.Next()
	}
}
