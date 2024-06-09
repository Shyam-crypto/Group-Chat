import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { createUser, editUser, deleteUser, getUsers, getUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/', verifyToken, isAdmin, createUser);
router.put('/:id', verifyToken, isAdmin, editUser);
router.delete('/:id', verifyToken, isAdmin, deleteUser);
router.get('/', verifyToken, getUsers);
router.get('/:id', verifyToken, getUser);

export default router;
