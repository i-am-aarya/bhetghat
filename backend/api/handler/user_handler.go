package handler

import (
	"bhetghat-server/service"

	"github.com/gofiber/fiber/v2"
)

type UserHandler struct {
	userService *service.UserService
}

func NewUserHandler(userService *service.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
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

func UpdateUserHandler(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"msg": "update user called"})
}

func DeleteUserHandler(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"msg": "delete called"})
}
