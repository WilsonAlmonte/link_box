FROM golang:1.27.1-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=arm64 \
  go build -o bin/server ./cmd/server

FROM alpine:3.20
COPY --from=builder /app/bin/server /server

ENV API_PORT=:8080
EXPOSE 8080

CMD ["/server"]

