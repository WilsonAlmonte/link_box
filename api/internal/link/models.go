package link

import "time"

type Link struct {
	ID    int64     `json:"id"`
	Label string    `json:"label"`
	URL   string    `json:"url"`
	Date  time.Time `json:"date"`
}
