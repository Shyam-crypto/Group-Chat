import express from 'express';
import { createGroup, deleteGroup, searchGroups, addMember } from '../controllers/groupController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, createGroup);
router.delete('/:id', verifyToken, deleteGroup);
router.get('/search', verifyToken, searchGroups);
router.post('/add-member', verifyToken, addMember);

export default router;

