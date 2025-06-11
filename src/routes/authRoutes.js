import express from 'express';
import {asyncHandler} from '../utils/asyncHandler.js';
import { registerUser, loginUser } from '../controllers/authControllers.js';

const router = express.Router();

router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));

export default router;