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

	if len(params.Password) < 8 {
		return nil, errors.New("password too short")
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
	user, err := s.userRepository.GetByField(ctx, "email", login.Email)
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
		"isAdmin":  user.IsAdmin,
		"expires":  time.Now().Add(4 * time.Hour).Unix(),
		// TODO ADD USER ROLE
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	SECRET_KEY, exists := os.LookupEnv("JWT_SECRET")
	if !exists {
		log.Fatal("JWT SECRET KEY NOT FOUND")
	}

	tokenString, err := token.SignedString([]byte(SECRET_KEY))
	if err != nil {
		return ""
	}
	return tokenString
}

func (s *UserService) VerifyUser(
	ctx context.Context,
	tokenString string,
) (*models.User, *jwt.MapClaims, error) {
	SECRET_KEY, exists := os.LookupEnv("JWT_SECRET")
	if !exists {
		return nil, nil, errors.New("Environment variable JWT_SECRET not set")
	}

	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return []byte(SECRET_KEY), nil
	})
	if err != nil {
		return nil, nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, nil, fmt.Errorf("invalid token")
	}

	if exp, ok := claims["exp"].(float64); ok {
		if time.Unix(int64(exp), 0).Before(time.Now()) {
			return nil, nil, fmt.Errorf("token has expired")
		}
	}

	emailFromClaims, exists := claims["email"]
	if !exists {
		return nil, nil, fmt.Errorf("email not found in claims\n")
	}
	user, err := s.userRepository.GetByField(ctx, "email", emailFromClaims)
	if err != nil {
		return nil, nil, fmt.Errorf("error finding user: %s\n", err.Error())
	}

	return user, &claims, nil
}
