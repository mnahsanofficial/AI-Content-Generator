# AI-Powered Content Generator & Management System

A production-grade full-stack application for generating and managing AI-powered content using the MERN stack with Redis queue processing. This system enables users to generate blog posts, product descriptions, and social media captions using OpenAI's GPT-4o-mini model, with automatic sentiment analysis, real-time updates, professional countdown timers, and ChatGPT-style markdown formatting.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=white)

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Architectural Decisions](#architectural-decisions)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Project Overview

This application is a comprehensive content generation platform that leverages AI to help users create high-quality content for various purposes. The system implements a queue-based architecture to handle AI content generation asynchronously, ensuring scalability and optimal user experience.

### Key Capabilities

- **User Authentication & Authorization**: Secure JWT-based authentication with password hashing
- **AI Content Generation**: Generate blog posts, product descriptions, and social media captions using OpenAI GPT models
- **Asynchronous Processing**: Queue-based job processing with BullMQ and Redis
- **Real-time Updates**: Socket.IO integration for instant content delivery
- **Sentiment Analysis**: Automatic sentiment analysis on generated content
- **Advanced Search**: Predictive search across content titles, prompts, and generated text
- **Content Management**: Full CRUD operations for managing generated content

### Use Cases

- Content creators generating blog posts
- E-commerce managers creating product descriptions
- Social media managers crafting engaging captions
- Marketing teams producing content at scale

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.0.4 | React framework with App Router for server-side rendering |
| **TypeScript** | 5.3.3 | Type-safe JavaScript for better code quality |
| **Tailwind CSS** | 3.4.0 | Utility-first CSS framework for rapid UI development |
| **Zustand** | 4.4.7 | Lightweight state management library |
| **Socket.IO Client** | 4.6.1 | Real-time bidirectional communication |
| **Axios** | 1.6.2 | HTTP client for API requests |
| **React Hook Form** | 7.49.2 | Performant form handling |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime environment |
| **Express** | 4.18.2 | Web application framework |
| **TypeScript** | 5.3.3 | Type-safe backend development |
| **MongoDB** | Latest | NoSQL database for flexible data storage |
| **Mongoose** | 8.0.3 | MongoDB object modeling tool |
| **Redis** | Latest | In-memory data store for job queue |
| **BullMQ** | 5.1.0 | Robust job queue implementation |
| **JWT** | 9.0.2 | Secure token-based authentication |
| **Bcrypt** | 2.4.3 | Password hashing |
| **OpenAI API** | 4.20.1 | AI content generation |
| **Socket.IO** | 4.6.1 | Real-time server communication |
| **Sentiment** | 5.0.2 | Sentiment analysis library |

### Development & Testing

| Technology | Purpose |
|------------|---------|
| **Jest** | Testing framework |
| **Supertest** | HTTP assertion library |
| **Docker** | Containerization for MongoDB and Redis |
| **ESLint** | Code linting |

---

## ✨ Features

### Core Features

- ✅ **User Registration & Login** - Secure authentication with JWT tokens
- ✅ **Content Generation** - AI-powered content creation for blogs, products, and captions
- ✅ **Queue-Based Processing** - Asynchronous job processing with 60-second delay simulation
- ✅ **Content Management** - Full CRUD operations (Create, Read, Update, Delete)
- ✅ **Real-time Updates** - Socket.IO for instant content delivery
- ✅ **Protected Routes** - Authentication middleware for secure endpoints
- ✅ **Responsive UI** - Mobile-first design with Tailwind CSS

### Advanced Features

- ✅ **Sentiment Analysis** - Automatic sentiment scoring and labeling
- ✅ **Predictive Search** - Real-time search with 300ms debouncing
- ✅ **Toast Notifications** - Professional error handling
- ✅ **Password Visibility Toggle** - Enhanced UX for password fields
- ✅ **Status Tracking** - Real-time job status updates (queued, processing, completed, failed)
- ✅ **Countdown Timer** - Professional 60-second countdown timer with visual progress indicator
- ✅ **Markdown Formatting** - ChatGPT-style text rendering with support for headings (#, ##, ###, ####), bold (**text**), and italic (*text*)
- ✅ **Comprehensive Testing** - Unit and integration tests for critical endpoints

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Next.js    │  │   Zustand    │  │ Socket.IO    │      │
│  │   (React)    │  │   (State)    │  │   Client     │      │
│  └──────┬───────┘  └──────────────┘  └──────┬───────┘      │
└─────────┼─────────────────────────────────────┼─────────────┘
          │                                     │
          │ HTTP/REST API                      │ WebSocket
          │                                     │
┌─────────▼─────────────────────────────────────▼─────────────┐
│                      Backend Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Express    │  │   Socket.IO  │  │   BullMQ     │      │
│  │   Server     │  │    Server    │  │    Queue     │      │
│  └──────┬───────┘  └──────────────┘  └──────┬───────┘      │
│         │                                     │               │
│  ┌──────▼───────┐                    ┌───────▼───────┐      │
│  │   Auth       │                    │   Content     │      │
│  │   Service    │                    │   Service     │      │
│  └──────────────┘                    └───────────────┘      │
└─────────┼─────────────────────────────────────┼─────────────┘
          │                                     │
          │                                     │
┌─────────▼─────────────────────────────────────▼─────────────┐
│                    Data & Processing Layer                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   MongoDB    │  │    Redis     │  │   Worker     │      │
│  │   (Data)     │  │   (Queue)    │  │  Process     │      │
│  └──────────────┘  └──────┬───────┘  └──────┬───────┘      │
│                           │                  │               │
│                    ┌──────▼──────────────────▼───────┐      │
│                    │      OpenAI API                  │      │
│                    │   (Content Generation)          │      │
│                    └──────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────┘
```

### Architecture Flow

1. **User Request** → Frontend sends generation request to backend
2. **Job Enqueue** → Backend creates job in BullMQ queue with 60s delay
3. **Immediate Response** → Backend returns HTTP 202 with job ID
4. **Countdown Timer** → Frontend displays professional 60-second countdown timer with visual progress
5. **Worker Processing** → Separate worker process handles job after delay
6. **AI Generation** → Worker calls OpenAI API (GPT-4o-mini) to generate content
7. **Sentiment Analysis** → Generated content is analyzed for sentiment
8. **Data Storage** → Content saved to MongoDB with status "completed"
9. **Real-time Notification** → Socket.IO emits event to frontend
10. **Content Display** → Frontend receives update, formats markdown (headings, bold, italic), and displays content

---

## 🚀 Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Redis** (local installation or cloud service like Upstash)
- **OpenAI API Key** - [Get API Key](https://platform.openai.com/api-keys)
- **Git** - [Download](https://git-scm.com/)

### Option 1: Using Docker (Recommended)

This is the easiest way to set up MongoDB and Redis locally.

#### Step 1: Clone the Repository

```bash
git clone https://github.com/mnahsanofficial/AI-Content-Generator.git
cd AI-Content-Generator
```

#### Step 2: Start MongoDB and Redis with Docker

```bash
docker-compose up -d
```

This will start:
- MongoDB on port `27017`
- Redis on port `6379`

Verify they're running:
```bash
docker ps
```

#### Step 3: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/content-generator

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# OpenAI API Key
OPENAI_API_KEY=sk-proj-your-openai-api-key-here

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

**Generate JWT Secret:**
```bash
# On macOS/Linux
openssl rand -base64 32

# Or use an online generator
```

#### Step 4: Start Backend Server

```bash
# Start the API server
npm run dev
```

The backend will be running at `http://localhost:5001`

#### Step 5: Start Worker Process

Open a **new terminal window** and run:

```bash
cd backend
npm run worker
```

The worker will process jobs from the queue.

#### Step 6: Frontend Setup

Open a **new terminal window**:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
touch .env.local
```

Add to `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
```

#### Step 7: Start Frontend Development Server

```bash
npm run dev
```

The frontend will be running at `http://localhost:3000`

### Option 2: Manual Setup (Without Docker)

If you prefer not to use Docker:

#### MongoDB Setup

1. **Local MongoDB:**
   ```bash
   # macOS (using Homebrew)
   brew install mongodb-community
   brew services start mongodb-community
   
   # Ubuntu/Debian
   sudo apt-get install mongodb
   sudo systemctl start mongodb
   ```

2. **Or use MongoDB Atlas (Cloud):**
   - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get connection string

#### Redis Setup

1. **Local Redis:**
   ```bash
   # macOS (using Homebrew)
   brew install redis
   brew services start redis
   
   # Ubuntu/Debian
   sudo apt-get install redis-server
   sudo systemctl start redis-server
   ```

2. **Or use Upstash (Cloud):**
   - Sign up at [upstash.com](https://upstash.com)
   - Create a free Redis database
   - Get connection details

Then follow Steps 3-7 from Option 1 above.

### Verification

1. **Backend Health Check:**
   ```bash
   curl http://localhost:5001/api/health
   ```
   Should return: `{"success":true,"message":"API is running",...}`

2. **Frontend:**
   - Open browser: `http://localhost:3000`
   - You should see the login page

3. **Test Registration:**
   - Register a new account
   - Login with credentials
   - Navigate to dashboard

---

## 📡 API Documentation

### Base URL

```
Development: http://localhost:5001/api
Production: Not Deployed
```

### Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

### Authentication Endpoints

#### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Validation Rules:**
- `name`: Required, minimum 2 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Email already exists"
}
```

---

#### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

### Content Generation Endpoints

#### 3. Generate Content

**Endpoint:** `POST /api/generate-content`

**Description:** Enqueue a content generation job. Returns immediately with job ID and status.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "prompt": "Write a blog post about artificial intelligence",
  "contentType": "blog"
}
```

**Content Types:**
- `blog` - Blog posts and articles
- `product` - Product descriptions
- `caption` - Social media captions

**Success Response (202 Accepted):**
```json
{
  "success": true,
  "data": {
    "jobId": "1",
    "status": "queued",
    "estimatedDelay": 60000,
    "contentId": "507f1f77bcf86cd799439011"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid content type"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Access denied"
}
```

**Note:** The job is processed asynchronously. Use the job ID to check status.

---

#### 4. Get Job Status

**Endpoint:** `GET /api/job/:jobId/status`

**Description:** Get the current status of a content generation job. Returns generated content if completed.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `jobId` - The job ID returned from generate-content endpoint

**Success Response (200) - Queued:**
```json
{
  "success": true,
  "data": {
    "jobId": "1",
    "status": "queued"
  }
}
```

**Success Response (200) - Processing:**
```json
{
  "success": true,
  "data": {
    "jobId": "1",
    "status": "processing"
  }
}
```

**Success Response (200) - Completed:**
```json
{
  "success": true,
  "data": {
    "jobId": "1",
    "status": "completed",
    "content": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "The Future of Artificial Intelligence",
      "prompt": "Write a blog post about artificial intelligence",
      "contentType": "blog",
      "generatedText": "Artificial Intelligence (AI) has revolutionized...",
      "status": "completed",
      "sentiment": {
        "score": 0.75,
        "label": "positive"
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Success Response (200) - Failed:**
```json
{
  "success": true,
  "data": {
    "jobId": "1",
    "status": "failed"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Job not found"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "error": "Access denied"
}
```

---

### Content Management Endpoints

#### 5. Get All Content

**Endpoint:** `GET /api/content`

**Description:** Retrieve all content for the authenticated user. Supports optional search query.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `search` (optional) - Search query to filter content

**Example:**
```
GET /api/content?search=blog
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "userId": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "title": "The Future of AI",
        "prompt": "Write about AI",
        "contentType": "blog",
        "generatedText": "Artificial Intelligence...",
        "status": "completed",
        "jobId": "1",
        "sentiment": {
          "score": 0.75,
          "label": "positive"
        },
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Access denied"
}
```

---

#### 6. Get Content by ID

**Endpoint:** `GET /api/content/:id`

**Description:** Retrieve a specific content item by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - MongoDB ObjectId of the content

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "content": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "The Future of AI",
      "prompt": "Write about AI",
      "contentType": "blog",
      "generatedText": "Artificial Intelligence...",
      "status": "completed",
      "sentiment": {
        "score": 0.75,
        "label": "positive"
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Content not found"
}
```

---

#### 7. Update Content

**Endpoint:** `PUT /api/content/:id`

**Description:** Update an existing content item.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `id` - MongoDB ObjectId of the content

**Request Body:**
```json
{
  "title": "Updated Title",
  "generatedText": "Updated content text"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "content": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Updated Title",
      "generatedText": "Updated content text",
      ...
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Content not found"
}
```

---

#### 8. Delete Content

**Endpoint:** `DELETE /api/content/:id`

**Description:** Delete a content item.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - MongoDB ObjectId of the content

**Success Response (200):**
```json
{
  "success": true,
  "message": "Content deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Content not found"
}
```

---

### Health Check Endpoint

#### 9. Health Check

**Endpoint:** `GET /api/health`

**Description:** Check if the API server is running.

**Success Response (200):**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🏛️ Architectural Decisions

This section explains the key architectural choices made during development and the rationale behind them.

### 1. Queue-Based Content Generation

**Decision:** Implement asynchronous job processing using BullMQ and Redis instead of synchronous API calls.

**Rationale:**
- **Scalability**: Prevents API timeouts during long-running AI operations
- **Reliability**: Jobs can be retried if they fail
- **User Experience**: Immediate response (HTTP 202) improves perceived performance
- **Rate Limiting**: Better control over OpenAI API rate limits
- **Resource Management**: Worker processes can be scaled independently

**Implementation:**
- Jobs are enqueued with a 60-second delay to simulate realistic processing time
- Separate worker process handles job execution
- Status tracking allows frontend to poll for completion

**Alternative Considered:** Synchronous API calls were rejected due to timeout risks and poor user experience.

---

### 2. TypeScript Across the Stack

**Decision:** Use TypeScript for both frontend and backend development.

**Rationale:**
- **Type Safety**: Catches errors at compile-time rather than runtime
- **Better IDE Support**: Enhanced autocomplete and refactoring capabilities
- **Maintainability**: Self-documenting code with type definitions
- **Team Collaboration**: Clearer contracts between frontend and backend
- **Reduced Bugs**: Type checking prevents common JavaScript errors

**Trade-offs:**
- Slightly longer initial setup time
- Additional compilation step required
- **Verdict**: Benefits far outweigh the minimal overhead

---

### 3. Zustand for State Management

**Decision:** Use Zustand instead of Redux or Context API.

**Rationale:**
- **Simplicity**: Minimal boilerplate compared to Redux
- **Performance**: Lightweight library with excellent performance
- **TypeScript Support**: Excellent TypeScript integration out of the box
- **Bundle Size**: Smaller than Redux (~1KB vs ~10KB)
- **Learning Curve**: Easier for developers new to state management
- **Sufficient for Use Case**: Application state is relatively simple (auth state)

**Comparison:**

| Feature | Zustand | Redux | Context API |
|---------|---------|-------|------------|
| Bundle Size | ~1KB | ~10KB | Built-in |
| Boilerplate | Minimal | High | Medium |
| DevTools | Yes | Excellent | Limited |
| TypeScript | Excellent | Good | Good |
| Performance | Excellent | Good | Can be slow |

**Alternative Considered:** 
- Redux: Rejected due to excessive boilerplate for simple auth state
- Context API: Rejected due to potential performance issues with frequent updates

---

### 4. Next.js App Router

**Decision:** Use Next.js 14 with App Router instead of Pages Router or Create React App.

**Rationale:**
- **Server Components**: Better performance with server-side rendering
- **File-based Routing**: Intuitive routing structure
- **Built-in Optimizations**: Image optimization, code splitting, etc.
- **API Routes**: Can handle API endpoints if needed (though we use separate backend)
- **Modern React Features**: Full support for React 18+ features
- **TypeScript**: Excellent TypeScript support

**Trade-offs:**
- Learning curve for App Router (newer than Pages Router)
- **Verdict**: Future-proof choice with better performance

---

### 5. MongoDB with Mongoose

**Decision:** Use MongoDB (NoSQL) instead of PostgreSQL or MySQL.

**Rationale:**
- **Flexible Schema**: Content structure may evolve; MongoDB adapts easily
- **Document Model**: Natural fit for content storage (JSON-like documents)
- **Horizontal Scaling**: Easier to scale horizontally
- **Mongoose ODM**: Provides schema validation and TypeScript support
- **Free Tier**: MongoDB Atlas offers generous free tier for development

**Schema Design:**
- User collection for authentication
- Content collection with embedded sentiment data
- Indexes on userId and createdAt for efficient queries

**Alternative Considered:** PostgreSQL was considered but MongoDB's flexibility for content storage was preferred.

---

### 6. BullMQ with Redis

**Decision:** Use BullMQ (built on Redis) for job queue management.

**Rationale:**
- **Reliability**: Built-in retry mechanisms and job persistence
- **Monitoring**: Built-in dashboard capabilities
- **TypeScript Support**: Excellent TypeScript definitions
- **Active Development**: Well-maintained library
- **Redis Backend**: Leverages Redis's speed and reliability

**Configuration:**
- Concurrency: 5 jobs processed simultaneously
- Rate Limiting: 10 jobs per minute (respects OpenAI limits)
- Job Delay: 60 seconds to simulate processing time

**Alternative Considered:** 
- Bull (v3): Rejected in favor of BullMQ (v5) for better TypeScript support
- Simple Redis queues: Rejected due to lack of built-in features

---

### 7. OpenAI GPT Models

**Decision:** Use OpenAI's GPT models via API instead of self-hosted models.

**Rationale:**
- **Quality**: State-of-the-art content generation quality
- **Reliability**: Managed service with high uptime
- **No Infrastructure**: No need to host and maintain ML models
- **Cost-Effective**: Pay-per-use pricing model
- **Easy Integration**: Simple REST API integration
- **Continuous Updates**: Access to latest model improvements

**Model Selection:**
- Using `gpt-4o-mini` for optimal balance of quality, speed, and cost-effectiveness
- Provides better quality than GPT-3.5 Turbo at lower cost
- Faster response times compared to GPT-4 while maintaining high quality

**Alternative Considered:** Self-hosted models (LLaMA, etc.) were rejected due to infrastructure complexity and lower quality.

---

### 8. Socket.IO for Real-time Updates

**Decision:** Implement Socket.IO for real-time content delivery.

**Rationale:**
- **User Experience**: Instant updates when content is ready
- **Efficiency**: Reduces polling overhead
- **Fallback Support**: Polling still works if WebSocket fails
- **Bidirectional**: Can send updates from server to client
- **Room-based**: User-specific event channels

**Implementation:**
- Frontend subscribes to user-specific events
- Worker emits events when jobs complete
- Frontend receives updates instantly
- Polling serves as fallback mechanism

**Alternative Considered:** 
- Server-Sent Events (SSE): Rejected due to unidirectional nature
- Polling only: Rejected due to inefficiency and poor UX

---

### 9. Sentiment Analysis Library

**Decision:** Use the `sentiment` npm library instead of cloud-based sentiment APIs.

**Rationale:**
- **Cost**: Free and open-source (no API costs)
- **Privacy**: Data stays on our servers
- **Performance**: Fast local processing
- **Reliability**: No external API dependencies
- **Sufficient Accuracy**: Good enough for content analysis use case

**Implementation:**
- Analyzes generated content automatically
- Returns score (-1 to 1) and label (positive/negative/neutral)
- Stored with content for quick retrieval

**Alternative Considered:** 
- Google Cloud Natural Language API: Rejected due to cost and external dependency
- AWS Comprehend: Rejected for same reasons

---

### 10. JWT Authentication

**Decision:** Use JWT tokens instead of session-based authentication.

**Rationale:**
- **Stateless**: No server-side session storage needed
- **Scalability**: Works across multiple servers without shared session store
- **Mobile Ready**: Easy to use with mobile apps
- **Standard**: Industry-standard authentication method
- **Security**: Tokens can be signed and verified

**Implementation:**
- Tokens expire after 7 days
- Stored in localStorage (frontend)
- Sent in Authorization header
- Verified on every protected route

**Security Measures:**
- Password hashing with bcrypt (10 rounds)
- Token expiration
- Secure token storage
- HTTPS in production

**Alternative Considered:** Session-based auth was rejected due to scalability concerns.

---

### 11. Separate Worker Process

**Decision:** Run worker process separately from API server.

**Rationale:**
- **Isolation**: Worker failures don't affect API server
- **Scalability**: Can scale workers independently
- **Resource Management**: Better CPU/memory allocation
- **Monitoring**: Easier to monitor and debug
- **Deployment**: Can deploy and update independently

**Implementation:**
- Worker runs as separate Node.js process
- Connects to same Redis instance
- Processes jobs from BullMQ queue
- Can run multiple workers for higher throughput

**Alternative Considered:** Running worker in same process was rejected due to coupling concerns.

---

### 12. Error Handling Strategy

**Decision:** Centralized error handling middleware.

**Rationale:**
- **Consistency**: Uniform error response format
- **Maintainability**: Single place to update error handling
- **Logging**: Centralized error logging
- **User Experience**: User-friendly error messages

**Implementation:**
- Express error middleware catches all errors
- Standardized error response format
- Error logging for debugging
- User-friendly messages (no stack traces in production)

---

## 📁 Project Structure

```
opti-assignment/
├── backend/
│   ├── src/
│   │   ├── app.ts                    # Express app entry point
│   │   ├── config/
│   │   │   ├── database.ts          # MongoDB connection
│   │   │   ├── redis.ts             # Redis connection
│   │   │   └── socket.ts            # Socket.IO setup
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts   # Auth endpoints logic
│   │   │   ├── content.controller.ts # Content CRUD logic
│   │   │   └── generate.controller.ts # Generation logic
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts   # JWT verification
│   │   │   └── error.middleware.ts  # Error handling
│   │   ├── models/
│   │   │   ├── User.ts              # User schema
│   │   │   └── Content.ts           # Content schema
│   │   ├── routes/
│   │   │   ├── auth.routes.ts       # Auth routes
│   │   │   ├── content.routes.ts    # Content routes
│   │   │   └── generate.routes.ts   # Generation routes
│   │   ├── services/
│   │   │   ├── auth.service.ts      # Auth business logic
│   │   │   ├── content.service.ts   # Content business logic
│   │   │   ├── ai.service.ts        # OpenAI integration
│   │   │   ├── queue.service.ts     # BullMQ operations
│   │   │   ├── sentiment.service.ts # Sentiment analysis
│   │   │   └── queue-events.service.ts # Socket.IO events
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript types
│   │   ├── utils/
│   │   │   └── logger.ts            # Logging utility
│   │   ├── workers/
│   │   │   └── content.worker.ts    # Job processor
│   │   └── __tests__/
│   │       ├── auth.test.ts         # Auth tests
│   │       ├── content.test.ts      # Content tests
│   │       └── setup.ts             # Test setup
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/               # Dashboard page
│   │   ├── generate/                # Generate page
│   │   ├── content/[id]/            # Content detail page
│   │   ├── login/                   # Login page
│   │   ├── register/                # Register page
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Home page
│   ├── components/
│   │   ├── ProtectedRoute.tsx       # Route protection
│   │   ├── AuthInitializer.tsx      # Auth initialization
│   │   ├── Toast.tsx                # Toast notifications
│   │   ├── ConfirmModal.tsx         # Delete confirmation
│   │   ├── TypingLoader.tsx         # Loading animation
│   │   ├── CountdownTimer.tsx       # 60-second countdown timer
│   │   └── Footer.tsx               # Footer component
│   ├── hooks/
│   │   └── useSocket.ts             # Socket.IO hook
│   ├── lib/
│   │   ├── api.ts                   # API client
│   │   ├── store.ts                 # Zustand store
│   │   └── socket.ts                # Socket.IO client
│   ├── utils/
│   │   └── markdownFormatter.tsx   # Markdown text formatter
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── docker-compose.yml               # Docker setup
├── README.md                         # This file
└── .gitignore
```

---

## 🧪 Testing

### Backend Testing

The backend includes comprehensive tests using Jest and Supertest.

**Run Tests:**
```bash
cd backend
npm test
```

**Test Coverage:**

#### Authentication Tests (`auth.test.ts`)
- ✅ User registration (success case)
- ✅ Registration with invalid email
- ✅ Registration with short password
- ✅ Duplicate email registration
- ✅ Login with valid credentials
- ✅ Login with invalid email
- ✅ Login with wrong password

#### Content CRUD Tests (`content.test.ts`)
- ✅ Get all user content (with authentication)
- ✅ Reject request without token
- ✅ Content creation requires authentication

**Test Structure:**
```typescript
describe('Authentication API', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await disconnectDatabase();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      // Test implementation
    });
  });
});
```

---

## 🚀 Deployment

### Free-Tier Deployment

The application can be deployed using 100% free-tier services:

- **Frontend**: Vercel (unlimited deployments)
- **Backend**: Render (750 hours/month)
- **Database**: MongoDB Atlas (512MB free)
- **Redis**: Upstash (10K commands/day free)

**Total Cost: $0/month**

For detailed deployment instructions, see deployment guides in the repository.

---

## 🤝 Contributing

This is a project submission. For questions or feedback, please contact:

**Nazmul Ahsan**
- LinkedIn: [linkedin.com/in/mn-ahsan](https://www.linkedin.com/in/mn-ahsan)
- GitHub: [github.com/mnahsanofficial](https://github.com/mnahsanofficial)
- Email: mnahsanofficial@gmail.com

---

## 🙏 Acknowledgments

- OpenAI for GPT models
- MongoDB for database infrastructure
- Redis for queue management
- Next.js and React communities
- All open-source contributors

---

**Built with ❤️ using the MERN stack**
