FROM golang:1.23-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# RUN go build -o server ./cmd/server
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o server ./cmd/server

# build the seeder script
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o seeder ./cmd/seed



FROM alpine:3.19

WORKDIR /app

COPY --from=builder /app/server .
COPY --from=builder /app/seeder .

EXPOSE 8000

CMD ["./server"]
