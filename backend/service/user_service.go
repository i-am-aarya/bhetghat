package service

import (
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
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

func NewUserService(userRepo repository.UserRepository, refreshRepo repository.RedisRefreshTokenRepo, jwt *jwt.JWT) *UserService {
	return &UserService{
		userRepo:    userRepo,
		refreshRepo: refreshRepo,
		jwt:         jwt,
	}
}

func (s *UserService) RegisterUser(ctx context.Context, params *models.CreateUserParams) (*models.User, models.TokenPair, error) {

	existingUser, err := s.userRepo.GetByEmail(ctx, params.Email)
	if err != nil {
		return nil, models.TokenPair{}, err
	}
	if existingUser != nil {
		return nil, models.TokenPair{}, ErrEmailUnavailable
	}

	existingUser, err = s.userRepo.GetByUsername(ctx, params.Username)
	if err != nil {
		return nil, models.TokenPair{}, err
	}
	if existingUser != nil {
		return nil, models.TokenPair{}, ErrUsernameUnavailable
	}

	if len(params.Password) < 8 {
		return nil, models.TokenPair{}, ErrPasswordTooShort
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
	user, err := s.userRepo.GetByUsername(ctx, login.Username)
	if err != nil {
		return nil, models.TokenPair{}, err
	}
	if user == nil {
		return nil, models.TokenPair{}, ErrInvalidLoginParams
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.HashedPassword), []byte(login.Password))
	if err != nil {
		return nil, models.TokenPair{}, ErrInvalidLoginParams
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

func (s *UserService) RefreshTokens(ctx context.Context, refreshToken string) (*models.User, models.TokenPair, error) {
	claims, err := s.jwt.ParseRefreshToken(refreshToken)
	if err != nil {
		return nil, models.TokenPair{}, err
	}

	userIDStr, ok := claims["userID"].(string)
	if !ok {
		return nil, models.TokenPair{}, errors.New("invalid userID type")
	}

	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return nil, models.TokenPair{}, errors.New("invalid userID")
	}

	if !s.refreshRepo.IsValid(ctx, userIDStr, refreshToken) {
		return nil, models.TokenPair{}, errors.New("invalid token")
	}

	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil || user == nil {
		return nil, models.TokenPair{}, errors.New("user not found")
	}

	if err := s.refreshRepo.Delete(ctx, user.ID.Hex(), refreshToken); err != nil {
		return nil, models.TokenPair{}, err
	}

	tokenPair, err := s.generateTokenPair(user)
	if err != nil {
		return nil, models.TokenPair{}, err
	}

	if err := s.refreshRepo.Store(ctx, user.ID.Hex(), tokenPair.RefreshToken, time.Hour*24*7); err != nil {
		return nil, models.TokenPair{}, err
	}

	return user, tokenPair, nil
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

func (s *UserService) UpdateUser(ctx context.Context, userID primitive.ObjectID, updateParams *models.UpdateUserParams) (*models.User, error) {

	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	if user == nil {
		return nil, ErrUserNotFound
	}

	if userID != user.ID {
		return nil, ErrUnauthorized
	}

	update := bson.M{}

	if updateParams.FirstName != "" {
		if len(updateParams.FirstName) > 6 {
			update["firstName"] = updateParams.FirstName
		} else {
			return nil, ErrFirstNameTooShort
		}
	}
	if updateParams.LastName != "" {
		if len(updateParams.LastName) > 6 {
			update["lastName"] = updateParams.LastName
		} else {
			return nil, ErrLastNameTooShort
		}
	}
	if updateParams.OldPassword != "" {
		if len(updateParams.OldPassword) >= 8 {
			err := bcrypt.CompareHashAndPassword([]byte(user.HashedPassword), []byte(updateParams.OldPassword))
			if err != nil {
				return nil, ErrInvalidPassword
			}
		} else {
			return nil, ErrPasswordTooShort
		}
	}
	if updateParams.NewPassword != "" {
		if updateParams.NewPassword == updateParams.ConfirmNewPassword {
			if len(updateParams.NewPassword) >= 8 {
				newHash, err := bcrypt.GenerateFromPassword([]byte(updateParams.NewPassword), bcrypt.DefaultCost)
				if err != nil {
					return nil, err
				}

				update["password"] = string(newHash)

			} else {
				return nil, ErrPasswordTooShort

			}
		} else {
			return nil, ErrPasswordsDontMatch

		}
	}

	return s.userRepo.Update(ctx, userID, &update)
}
