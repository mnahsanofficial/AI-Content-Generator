# Quick Setup Guide

## Prerequisites
- Node.js 18+ and npm/yarn
- Docker (optional, for MongoDB and Redis)
- OpenAI API key

## Step-by-Step Setup

### 1. Start Infrastructure Services

**Option A: Using Docker (Recommended)**
```bash
docker-compose up -d
```

**Option B: Manual Setup**
- Start MongoDB: `mongod` (or use MongoDB Atlas)
- Start Redis: `redis-server`

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev  # Terminal 1: Start API server
npm run worker  # Terminal 2: Start worker process
```

**Required Environment Variables (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/content-generator
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
OPENAI_API_KEY=sk-proj-...
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
# Create .env.local (optional, defaults work for local dev)
npm run dev
```

**Optional Environment Variables (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/health

## Testing the Flow

1. **Register/Login**: Create an account at http://localhost:3000/register
2. **Generate Content**: Go to /generate, enter a prompt, select content type
3. **Monitor Status**: Watch the status update from "queued" → "processing" → "completed"
4. **View Content**: Check the dashboard to see all your generated content

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `docker-compose ps` or `mongod`
- Check MONGODB_URI in .env

### Redis Connection Error
- Ensure Redis is running: `docker-compose ps` or `redis-server`
- Check REDIS_HOST and REDIS_PORT in .env

### Worker Not Processing Jobs
- Ensure worker process is running: `npm run worker` in backend directory
- Check Redis connection
- Verify OpenAI API key is valid

### Socket.IO Not Working
- Check CORS_ORIGIN matches frontend URL
- Verify Socket.IO server is initialized (check backend logs)
- Check browser console for connection errors

## Production Build

### Backend
```bash
cd backend
npm run build
npm start  # Start API server
npm run worker:prod  # Start worker
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## Architecture Notes

- **API Server**: Handles HTTP requests, authentication, enqueues jobs
- **Worker Process**: Processes queued jobs, calls OpenAI API, updates database
- **Queue**: BullMQ with Redis backend, 60-second delay before processing
- **Real-time**: Socket.IO for instant updates when content is ready (optional, polling also works)

