package link

import (
	"api/internal/database"
	"api/internal/domain"
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
)

type LinkService struct {
	q *database.Queries
}

func NewService(pool database.DBTX) *LinkService {
	q := database.New(pool)
	return &LinkService{q: q}
}

func (r *LinkService) List(ctx context.Context) ([]Link, error) {
	rawLinks, err := r.q.ListLinks(ctx)
	if err != nil {
		return nil, err
	}

	links := make([]Link, len(rawLinks))

	for k, v := range rawLinks {
		links[k] = Link{ID: v.LinkID, Label: v.Label, URL: v.Value, Date: v.Date.Time}
	}

	return links, nil
}

func (r *LinkService) Create(ctx context.Context, label string, value string) (Link, error) {
	dLink, err := r.q.CreateLink(ctx, database.CreateLinkParams{Label: label, Value: value})
	if err != nil {
		return Link{}, domain.Internal(err)
	}

	return Link{ID: dLink.LinkID, URL: dLink.Value, Label: dLink.Label, Date: dLink.Date.Time}, nil
}

func (r *LinkService) GetByID(ctx context.Context, id int64) (Link, error) {
	dLink, err := r.q.GetLink(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return Link{}, domain.NotFound("get by id: link not found: %d", id)
		}
		return Link{}, domain.Internal(err)
	}

	return Link{ID: dLink.LinkID, URL: dLink.Value, Label: dLink.Label, Date: dLink.Date.Time}, nil
}

func (r *LinkService) Delete(ctx context.Context, id int64) error {
	_, err := r.q.DeleteLink(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return domain.NotFound("delete: link not found: %d", id)
		}

		return domain.Internal(err)
	}

	return nil
}
