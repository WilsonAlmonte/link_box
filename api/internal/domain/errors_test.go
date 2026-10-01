package domain

import (
	"errors"
	"testing"
)

func TestNotFound(t *testing.T) {
	err := NotFound("link %d not found", 123)
	if err.Kind != KindNotFound {
		t.Errorf("expected kind %s, got %s", KindNotFound, err.Kind)
	}
	expectedMsg := "link 123 not found"
	if err.Message != expectedMsg {
		t.Errorf("expected message %s, got %s", expectedMsg, err.Message)
	}
	expectedErrorStr := "NOT_FOUND: link 123 not found"
	if err.Error() != expectedErrorStr {
		t.Errorf("expected Error() %q, got %q", expectedErrorStr, err.Error())
	}
}

func TestInvalidInput(t *testing.T) {
	err := InvalidInput("invalid url: %s", "http://bad")
	if err.Kind != KindnvalidInput {
		t.Errorf("expected kind %s, got %s", KindnvalidInput, err.Kind)
	}
	expectedMsg := "invalid url: http://bad"
	if err.Message != expectedMsg {
		t.Errorf("expected message %s, got %s", expectedMsg, err.Message)
	}
}

func TestInternal(t *testing.T) {
	underlying := errors.New("database connection lost")
	err := Internal(underlying)
	if err.Kind != KindInternal {
		t.Errorf("expected kind %s, got %s", KindInternal, err.Kind)
	}
	if err.Message != "internal error" {
		t.Errorf("expected message 'internal error', got %s", err.Message)
	}
	if !errors.Is(err, underlying) {
		t.Error("expected err to wrap the underlying error")
	}
	expectedErrorStr := "INTERNAL: internal error: database connection lost"
	if err.Error() != expectedErrorStr {
		t.Errorf("expected Error() %q, got %q", expectedErrorStr, err.Error())
	}
	if err.Unwrap() != underlying {
		t.Errorf("expected unwrapped error to be %v, got %v", underlying, err.Unwrap())
	}
}
