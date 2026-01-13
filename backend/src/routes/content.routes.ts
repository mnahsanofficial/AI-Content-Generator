import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  getAllContent,
  getContentById,
  updateContent,
  deleteContent,
} from '../controllers/content.controller';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', getAllContent);
router.get('/:id', getContentById);
router.put('/:id', updateContent);
router.delete('/:id', deleteContent);

export default router;

