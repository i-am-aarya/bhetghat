package config

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"

	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client

func InitRedis() error {
	addr := os.Getenv("REDIS_ADDR")
	if addr == "" {
		log.Fatal("redis address not found")
		return errors.New("redis address not found!")
	}

	password := os.Getenv("REDIS_PASSWORD")

	RedisClient = redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
		DB:       0,
		PoolSize: 10,
	})

	ctx := context.Background()
	if err := RedisClient.Ping(ctx).Err(); err != nil {
		return fmt.Errorf("redis connection failed: %w", err)
	}

	return nil

}
