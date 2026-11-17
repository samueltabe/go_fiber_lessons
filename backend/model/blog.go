package model

type Blog struct {
	ID    uint   `json:"id" gorm:"primaryKey"`
	Title string `json:"title" form:"title" gorm:"column:title;size:255;not null"`
	Post  string `json:"post" form:"post" gorm:"column:post;type:text;not null"`
	// Public path of the uploaded image, e.g. "/static/uploads/1731772800-a1b2c3d4.jpg".
	// Set by the server only, never from the request body.
	Image string `json:"image" form:"-" gorm:"column:image;size:255"`
}
