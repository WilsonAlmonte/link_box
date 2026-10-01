package link

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Result struct {
	Data    any `json:"data"`
	Success any `json:"success"`
}

func CreateErrorResult(msg string) *Result {
	return &Result{Data: struct{ message string }{message: msg}, Success: false}
}

type CreateLinkRequest struct {
	Label string `json:"label"`
	URL   string `json:"url" binding:"required,url"`
}

func NewLinkHandler(s *LinkService) *Handler {
	return &Handler{service: s}
}

type Handler struct {
	service *LinkService
}

func (h *Handler) ListLinks(c *gin.Context) {
	links, err := h.service.List(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, CreateErrorResult("internal error"))
		return
	}
	c.JSON(http.StatusOK, Result{Data: links, Success: true})
}

func (h *Handler) CreateLink(c *gin.Context) {
	var req CreateLinkRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, CreateErrorResult(err.Error()))
		return
	}

	link, err := h.service.Create(c, req.Label, req.URL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, CreateErrorResult("internal error"))
		return
	}

	c.JSON(http.StatusOK, Result{Data: link, Success: true})
}

func (h *Handler) DeleteLink(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, CreateErrorResult("invalid id"))
		return
	}

	err = h.service.Delete(c, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, CreateErrorResult("internal error"))
		return
	}

	c.JSON(http.StatusOK, Result{Data: nil, Success: true})
}
