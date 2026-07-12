package jwt

import (
	"bhetghat-server/models"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type JWT struct {
	secret string
}

func New(secret string) *JWT {
	return &JWT{
		secret: secret,
	}
}

func (j *JWT) GenerateAccessToken(user *models.User) (string, error) {
	claims := jwt.MapClaims{
		"userID":   user.ID,
		"username": user.Username,
		"email":    user.Email,
		"isAdmin":  user.IsAdmin,
		"exp":      time.Now().Add(15 * time.Minute).Unix(),
		"type":     "access",
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(j.secret))
}

func (j *JWT) GenerateRefreshToken(user *models.User) (string, error) {
	claims := jwt.MapClaims{
		"userID":   user.ID,
		"username": user.Username,
		"email":    user.Email,
		"isAdmin":  user.IsAdmin,
		"exp":      time.Now().Add(7 * time.Hour * 24).Unix(),
		"type":     "refresh",
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(j.secret))
}

func (j *JWT) ParseAccessToken(tokenString string) (jwt.MapClaims, error) {
	return j.parseToken(tokenString, "access")
}

func (j *JWT) ParseRefreshToken(tokenString string) (jwt.MapClaims, error) {
	return j.parseToken(tokenString, "refresh")
}

func (j *JWT) parseToken(tokenString, expectedType string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}

		return []byte(j.secret), nil
	})
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token claims")
	}

	if exp, ok := claims["exp"].(float64); ok {
		if time.Now().Unix() > int64(exp) {
			return nil, errors.New("token expired")
		}
	}

	tokenType, ok := claims["type"].(string)
	if !ok || tokenType != expectedType {
		return nil, fmt.Errorf("expected %s token, got %s", expectedType, tokenType)
	}

	return claims, nil
}
