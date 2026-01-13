import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  generateContent,
  getContentStatus,
  validateGenerateContent,
} from '../controllers/generate.controller';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/generate-content', validateGenerateContent, generateContent);
router.get('/job/:jobId/status', getContentStatus);

export default router;

