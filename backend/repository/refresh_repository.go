package repository

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type RefreshTokenRepository interface {
	Store(ctx context.Context, userID string, token string, ttl time.Duration) error
	IsValid(ctx context.Context, userID string, token string) bool
	Delete(ctx context.Context, userID string, token string) error
	DeleteAllForUser(ctx context.Context, userID string) error
}

type RedisRefreshTokenRepo struct {
	client *redis.Client
}

func NewRedisRefreshTokenRepo(client *redis.Client) *RedisRefreshTokenRepo {
	return &RedisRefreshTokenRepo{
		client: client,
	}
}

func (r *RedisRefreshTokenRepo) key(userID, tokenHash string) string {
	return fmt.Sprintf("refresh:%s:%s", userID, tokenHash)
}

func (r *RedisRefreshTokenRepo) hash(token string) string {
	h := sha256.Sum256([]byte(token))
	return hex.EncodeToString(h[:])
}

func (r *RedisRefreshTokenRepo) Store(ctx context.Context, userID string, token string, ttl time.Duration) error {
	return r.client.Set(ctx, r.key(userID, r.hash(token)), "1", ttl).Err()
}

func (r *RedisRefreshTokenRepo) IsValid(ctx context.Context, userID, token string) bool {
	err := r.client.Get(ctx, r.key(userID, r.hash(token))).Err()
	return err == nil
}

func (r *RedisRefreshTokenRepo) Delete(ctx context.Context, userID, tokenString string) error {
	return r.client.Del(ctx, r.key(userID, r.hash(tokenString))).Err()
}

func (r *RedisRefreshTokenRepo) DeleteAllForUser(ctx context.Context, userID string) error {
	pattern := fmt.Sprintf("refresh:%s:*", userID)
	iter := r.client.Scan(ctx, 0, pattern, 0).Iterator()
	var keys []string
	for iter.Next(ctx) {
		keys = append(keys, iter.Val())
	}

	if len(keys) > 0 {
		return r.client.Del(ctx, keys...).Err()
	}
	return nil
}
