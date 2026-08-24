# BhetGhat

**BhetGhat** is an open-source proximity-based video collaboration platform inspired by virtual spaces like Gather.

## Tech stack

#### Backend

- Go (fiber)
- MongoDB
- WebSockets

#### Frontend

- React
- TypeScript
- Vite
- Zustand
- TailwindCSS
- shadcn/ui

## Project structure

```text
bhetghat/
├── frontend/           # React + TypeScript client
├── backend/            # Go backend
└── docker-compose.yml
```

## Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
go run .
```
