package handler

import "github.com/gofiber/fiber/v2"

func PingHandler(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"msg": "pong"})
}
