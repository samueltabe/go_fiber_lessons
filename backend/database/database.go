package database

import (
	"log"
	"os"

	"github.com/samueltabe/gofiber-blog/model"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DBconn *gorm.DB

func ConnectDB() {
	user := os.Getenv("db_user")
	password := os.Getenv("db_password")
	dbName := os.Getenv("db_name")

	dsn := user + ":" + password + "@tcp(127.0.0.1:3306)/" + dbName + "?charset=utf8mb4&parseTime=True&loc=Local"

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Error),
	})

	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Database connection established.")

	if err := db.AutoMigrate(&model.Blog{}); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	DBconn = db
}
