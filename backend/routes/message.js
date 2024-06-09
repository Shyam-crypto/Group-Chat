import express from 'express';
import { sendMessage, likeMessage } from '../controllers/messageController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, sendMessage);
router.post('/:id/like', verifyToken, likeMessage);

export default router;
