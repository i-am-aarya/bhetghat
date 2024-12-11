package service

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"bhetghat-server/models"
	"bhetghat-server/repository"
)

type UserService struct {
	userRepository repository.UserRepository
}

func NewUserService(userRepo repository.UserRepository) *UserService {
	return &UserService{
		userRepository: userRepo,
	}
}

func (s *UserService) CreateUser(
	ctx context.Context,
	params *models.CreateUserParams,
) (*models.User, error) {
	existingUser, err := s.userRepository.GetByField(ctx, "email", params.Email)
	if err != nil {
		return nil, err
	}
	if existingUser != nil {
		return nil, errors.New("email already in use")
	}

	existingUser, err = s.userRepository.GetByField(ctx, "username", params.Username)
	if err != nil {
		return nil, err
	}
	if existingUser != nil {
		return nil, errors.New("username already in use")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(params.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		FirstName:      params.FirstName,
		LastName:       params.LastName,
		Email:          params.Email,
		Username:       params.Username,
		HashedPassword: string(hashedPassword),
	}

	return user, nil
}

func (s *UserService) RegisterUser(ctx context.Context, user *models.User) (*models.User, error) {
	user, err := s.userRepository.Insert(ctx, user)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *UserService) LoginUser(
	ctx context.Context,
	login *models.LoginUserParams,
) (*models.User, string, error) {

	user, err := s.userRepository.GetByField(ctx, "username", login.Username)
	if err != nil {
		return nil, "", err
	}
	if user == nil {
		return nil, "", errors.New("invalid username or password")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.HashedPassword), []byte(login.Password))
	if err != nil {
		return nil, "", errors.New("invalid username or password")
	}

	token := s.CreateTokenFromUser(user)
	if token == "" {
		return nil, "", errors.New("error logging in")
	}

	return user, token, nil
}

func (s *UserService) CreateTokenFromUser(user *models.User) string {
	claims := jwt.MapClaims{
		"userID":   user.ID,
		"username": user.Username,
		"email":    user.Email,
		"expires":  time.Now().Add(4 * time.Hour).Unix(),
		// TODO ADD USER ROLE
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// SECRET_KEY := os.Getenv("JWT_SECRET")

	SECRET_KEY, exists := os.LookupEnv("JWT_SECRET")
	if !exists {
		log.Fatal("Environment variable JWT_SECRET not set")
	}

	fmt.Println("---- SECRET KEY: ", SECRET_KEY)
	tokenString, err := token.SignedString([]byte(SECRET_KEY))
	if err != nil {
		return ""
	}
	return tokenString
}

// func (s *UserService) GetByUsernameOrEmail(username, email string) (*models.User, error) {
// }
