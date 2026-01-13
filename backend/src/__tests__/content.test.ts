import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { AuthService } from '../services/auth.service';
import contentRoutes from '../routes/content.routes';
import { errorMiddleware } from '../middleware/error.middleware';

const app = express();
app.use(express.json());
app.use('/api/content', contentRoutes);
app.use(errorMiddleware);

describe('Content API', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    await connectDatabase();
    
    // Register and login a user for authenticated tests
    const registerResult = await AuthService.register(
      'Content Test User',
      'contenttest@example.com',
      'password123'
    );
    
    if (registerResult.success && registerResult.data) {
      authToken = registerResult.data.token;
      userId = registerResult.data.user.id;
    }
  });

  afterAll(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await disconnectDatabase();
  });

  describe('GET /api/content', () => {
    it('should get all user content with valid token', async () => {
      const response = await request(app)
        .get('/api/content')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('content');
      expect(Array.isArray(response.body.data.content)).toBe(true);
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/content');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/content/:id', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .put('/api/content/507f1f77bcf86cd799439011')
        .send({
          title: 'Updated Title',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/content/:id', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .delete('/api/content/507f1f77bcf86cd799439011');

      expect(response.status).toBe(401);
    });
  });
});
