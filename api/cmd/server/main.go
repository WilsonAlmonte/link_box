package main

import (
	"api/internal/link"
	"context"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	Run()
}

func ValidateKey() gin.HandlerFunc {
	return func(c *gin.Context) {
		apiKey := c.GetHeader("X-API-Key")
		if apiKey != os.Getenv("API_KEY") {
			c.AbortWithStatus(http.StatusUnauthorized)
		}
		c.Next()
	}
}

func Run() {
	ctx := context.Background()
	cfg, err := pgxpool.ParseConfig(os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalf("Invalid config format: %v", err)
	}
	pool, err := pgxpool.NewWithConfig(ctx, cfg)
	if err != nil {
		log.Fatalf("Failed to create pool structure: %v", err)
	}
	defer pool.Close()

	linkService := link.NewService(pool)
	linkHandler := link.NewLinkHandler(linkService)
	router := gin.Default()

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowHeaders = append(corsConfig.AllowHeaders, "X-API-Key")
	router.Use(cors.New(corsConfig))

	router.Use(ValidateKey())

	router.GET("/links", linkHandler.ListLinks)
	router.POST("/links", linkHandler.CreateLink)
	router.DELETE("/links/:id", linkHandler.DeleteLink)
	router.GET("/health", func(c *gin.Context) {
		if err := pool.Ping(c); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "database is down"})
		}
		c.JSON(http.StatusOK, gin.H{"message": "API is alive, database is healthy"})
	})

	router.Run(os.Getenv("API_PORT"))
}
