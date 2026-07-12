package service

import (
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"

	"bhetghat-server/jwt"
	"bhetghat-server/models"
	"bhetghat-server/repository"
)

type UserService struct {
	userRepo    repository.UserRepository
	refreshRepo repository.RedisRefreshTokenRepo
	jwt         *jwt.JWT
}

func NewUserService(userRepo repository.UserRepository, refreshRepo repository.RedisRefreshTokenRepo, jwtSecret string) *UserService {
	return &UserService{
		userRepo:    userRepo,
		refreshRepo: refreshRepo,
		jwt:         jwt.New(jwtSecret),
	}
}

func (s *UserService) RegisterUser(ctx context.Context, params *models.CreateUserParams) (*models.User, models.TokenPair, error) {

	existingUser, err := s.userRepo.GetByField(ctx, "email", params.Email)
	if err != nil {
		return nil, models.TokenPair{}, err
	}
	if existingUser != nil {
		return nil, models.TokenPair{}, errors.New("email already in use")
	}

	existingUser, err = s.userRepo.GetByField(ctx, "username", params.Username)
	if err != nil {
		return nil, models.TokenPair{}, err
	}
	if existingUser != nil {
		return nil, models.TokenPair{}, errors.New("username already in use")
	}

	if len(params.Password) < 8 {
		return nil, models.TokenPair{}, errors.New("password too short")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(params.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, models.TokenPair{}, err
	}

	user := &models.User{
		Email:          params.Email,
		Username:       params.Username,
		HashedPassword: string(hashedPassword),
	}

	user, err = s.userRepo.Insert(ctx, user)
	if err != nil {
		return nil, models.TokenPair{}, err
	}

	tokens, err := s.generateTokenPair(user)
	if err != nil {
		return nil, models.TokenPair{}, err
	}

	if err := s.refreshRepo.Store(ctx, user.ID.Hex(), tokens.RefreshToken, 7*24*time.Hour); err != nil {
		return nil, models.TokenPair{}, err
	}

	return user, tokens, nil
}

func (s *UserService) LoginUser(
	ctx context.Context,
	login *models.LoginUserParams,
) (*models.User, models.TokenPair, error) {
	user, err := s.userRepo.GetByField(ctx, "username", login.Username)
	if err != nil {
		return nil, models.TokenPair{}, err
	}
	if user == nil {
		return nil, models.TokenPair{}, errors.New("invalid username or password")
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.HashedPassword), []byte(login.Password))
	if err != nil {
		return nil, models.TokenPair{}, errors.New("invalid username or password")
	}

	tokenPair, err := s.generateTokenPair(user)
	if err != nil {
		return nil, models.TokenPair{}, err
	}

	if err := s.refreshRepo.Store(ctx, user.ID.Hex(), tokenPair.RefreshToken, 7*24*time.Hour); err != nil {
		return nil, models.TokenPair{}, err
	}

	return user, tokenPair, nil
}

func (s *UserService) generateTokenPair(user *models.User) (models.TokenPair, error) {
	accessToken, err := s.jwt.GenerateAccessToken(user)
	if err != nil {
		return models.TokenPair{}, err
	}
	refreshToken, err := s.jwt.GenerateRefreshToken(user)
	if err != nil {
		return models.TokenPair{}, err
	}
	return models.TokenPair{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *UserService) VerifyAccessToken(ctx context.Context, tokenString string) (*models.User, error) {
	claims, err := s.jwt.ParseAccessToken(tokenString)
	if err != nil {
		return nil, err
	}

	userID, err := primitive.ObjectIDFromHex(claims["userID"].(string))
	if err != nil {
		return nil, err
	}

	return s.userRepo.GetByID(ctx, userID)
}

func (s *UserService) RefreshTokens(ctx context.Context, refreshToken string) (models.TokenPair, error) {
	claims, err := s.jwt.ParseRefreshToken(refreshToken)
	if err != nil {
		return models.TokenPair{}, err
	}

	userIDStr, ok := claims["userID"].(string)
	if !ok {
		return models.TokenPair{}, errors.New("invalid userID type")
	}

	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return models.TokenPair{}, errors.New("invalid userID")
	}

	if !s.refreshRepo.IsValid(ctx, userIDStr, refreshToken) {
		return models.TokenPair{}, errors.New("invalid token")
	}

	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil || user == nil {
		return models.TokenPair{}, errors.New("user not found")
	}

	if err := s.refreshRepo.Delete(ctx, user.ID.Hex(), refreshToken); err != nil {
		return models.TokenPair{}, err
	}

	tokenPair, err := s.generateTokenPair(user)
	if err != nil {
		return models.TokenPair{}, err
	}

	if err := s.refreshRepo.Store(ctx, user.ID.Hex(), tokenPair.RefreshToken, time.Hour*24*7); err != nil {
		return models.TokenPair{}, err
	}

	return tokenPair, nil
}

func (s *UserService) LogoutUser(ctx context.Context, refreshToken string) error {
	claims, err := s.jwt.ParseRefreshToken(refreshToken)
	if err != nil {
		return err
	}

	userID, ok := claims["userID"].(string)
	if !ok {
		return errors.New("bad token")
	}

	return s.refreshRepo.Delete(ctx, userID, refreshToken)
}
