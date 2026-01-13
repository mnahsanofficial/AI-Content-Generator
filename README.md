# AI-Powered Content Generator & Management System

A production-grade full-stack application for generating and managing AI-powered content using the MERN stack with Redis queue processing.

## 🏗️ System Architecture

```
┌─────────────┐
│   Next.js   │  Frontend (App Router + TypeScript)
│   Frontend  │  └─ Zustand for state management
└──────┬──────┘  └─ Tailwind CSS for styling
       │
       │ HTTP/REST API
       │
┌──────▼──────────────────────────────────────┐
│         Express + TypeScript Backend        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Auth   │  │ Content │  │  Queue   │  │
│  │  (JWT)   │  │   CRUD  │  │  (Bull)  │  │
│  └──────────┘  └──────────┘  └────┬─────┘  │
└──────┬────────────────────────────┼────────┘
       │                            │
       │                            │
┌──────▼──────┐            ┌────────▼────────┐
│   MongoDB   │            │  Redis + BullMQ │
│  (Mongoose) │            │     Queue       │
└─────────────┘            └────────┬────────┘
                                    │
                           ┌────────▼────────┐
                           │  Worker Process │
                           │  (Node.js)      │
                           │  └─ OpenAI API │
                           └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (State Management)
- **Socket.IO Client** (Real-time updates)

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **MongoDB** + **Mongoose**
- **JWT** (Authentication)
- **Redis** + **BullMQ** (Job Queue)
- **OpenAI API** (Content Generation)
- **Socket.IO** (Real-time communication)
- **bcrypt** (Password hashing)

## 📁 Project Structure

```
opti-assignment/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── redis.ts
│   │   │   └── socket.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── content.controller.ts
│   │   │   └── generate.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Content.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── content.routes.ts
│   │   │   └── generate.routes.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── content.service.ts
│   │   │   ├── ai.service.ts
│   │   │   └── queue.service.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── logger.ts
│   │   ├── workers/
│   │   │   └── content.worker.ts
│   │   └── app.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/
│   │   ├── generate/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   ├── lib/
│   │   ├── api.ts
│   │   └── store.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.ts
├── docker-compose.yml
└── README.md
```

## 🚀 Local Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB (local or Atlas)
- Redis (local or Docker)
- OpenAI API key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/content-generator
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
OPENAI_API_KEY=sk-proj-...
NODE_ENV=development
```

5. Start MongoDB and Redis:
```bash
# Using Docker Compose (recommended)
docker-compose up -d

# Or start manually
# MongoDB: mongod
# Redis: redis-server
```

6. Start the backend server:
```bash
npm run dev
```

7. Start the worker process (in a separate terminal):
```bash
npm run worker
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 📡 API Documentation

### Authentication

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt-token-here"
  }
}
```

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:** Same as register

### Content Generation

#### POST /api/generate-content
Enqueue a content generation job.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "prompt": "Write a blog post about AI",
  "contentType": "blog"
}
```

**Response (202 Accepted):**
```json
{
  "success": true,
  "data": {
    "jobId": "job-id-here",
    "status": "queued",
    "estimatedDelay": 60000
  }
}
```

#### GET /api/content/:jobId/status
Get job status and generated content (if completed).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "jobId": "job-id-here",
    "status": "completed",
    "content": {
      "id": "...",
      "title": "...",
      "generatedText": "...",
      "createdAt": "..."
    }
  }
}
```

### Content Management

#### GET /api/content
Get all user's content.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "content": [...]
  }
}
```

#### GET /api/content/:id
Get specific content by ID.

#### PUT /api/content/:id
Update content.

#### DELETE /api/content/:id
Delete content.

## 🔄 Content Generation Flow

1. **User submits generation request** → Frontend calls `POST /api/generate-content`
2. **Backend enqueues job** → Job added to BullMQ with 60s delay
3. **Backend returns 202** → Job ID and status returned immediately
4. **Frontend polls status** → Calls `GET /api/content/:jobId/status` every 5s
5. **Worker processes job** → After delay, worker calls OpenAI API
6. **Worker saves content** → Content saved to MongoDB with status "completed"
7. **Frontend receives content** → Polling detects completion, displays content
8. **Optional: Socket.IO** → Real-time push when job completes (bonus)

## 🏗️ Architectural Decisions

1. **Queue-based Processing**: Prevents API timeouts and allows scalable job processing
2. **60-second Delay**: Simulates realistic AI processing time and prevents rate limiting
3. **Separate Worker Process**: Isolates AI processing from API server for better reliability
4. **JWT Authentication**: Stateless, scalable authentication
5. **TypeScript**: Type safety across the entire stack
6. **MongoDB**: Flexible schema for content storage
7. **BullMQ**: Robust job queue with Redis backend
8. **Socket.IO**: Optional real-time updates for better UX

## 🔒 Security Practices

- Password hashing with bcrypt (10 rounds)
- JWT tokens with expiration
- Protected routes with auth middleware
- Environment variables for secrets
- Input validation and sanitization
- CORS configuration
- Rate limiting (recommended for production)

## 🧪 Testing

Backend tests are implemented using Jest and Supertest.

Run backend tests:
```bash
cd backend
npm test
```

Test coverage includes:
- Authentication endpoints (register, login)
- Content CRUD endpoints
- Input validation
- Error handling

## 📊 Sentiment Analysis

The system automatically analyzes sentiment of generated content:
- Sentiment is calculated when content generation completes
- Results include:
  - **Score**: -1 (negative) to +1 (positive)
  - **Label**: positive, negative, or neutral
- Sentiment is displayed on the dashboard for each content item

## 🔍 Predictive Search

The dashboard includes a powerful search feature:
- **Real-time search** with 300ms debouncing
- **Search across**:
  - Content titles
  - Prompts
  - Generated text
- **Instant results** as you type
- **Clear search** button for easy reset

## 🐳 Docker Setup

Start MongoDB and Redis with Docker:
```bash
docker-compose up -d
```

## 📝 License

MIT

