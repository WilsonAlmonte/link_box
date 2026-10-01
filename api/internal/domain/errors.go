package domain

import "fmt"

type Kind string

const (
	KindNotFound    Kind = "NOT_FOUND"
	KindInternal    Kind = "INTERNAL"
	KindnvalidInput Kind = "INVALID_INPUT"
)

type Error struct {
	Kind    Kind   `json:"kind"`
	Message string `json:"message"`
	Err     error  `json:"-"`
}

func (e *Error) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %s: %v", e.Kind, e.Message, e.Err)
	}

	return fmt.Sprintf("%s: %s", e.Kind, e.Message)
}

func (e *Error) Unwrap() error {
	return e.Err
}

func NotFound(m string, args ...any) *Error {
	return &Error{Kind: KindNotFound, Message: fmt.Sprintf(m, args...)}
}

func InvalidInput(m string, args ...any) *Error {
	return &Error{Kind: KindnvalidInput, Message: fmt.Sprintf(m, args...)}
}

func Internal(err error) *Error {
	return &Error{Kind: KindInternal, Message: "internal error", Err: err}
}
