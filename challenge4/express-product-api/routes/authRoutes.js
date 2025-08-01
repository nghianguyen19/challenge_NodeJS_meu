import express from 'express';
import { register, verifyOTP, login } from '../controllers/authController.js'; 

const router = express.Router();

router.post('/register', register);    // Gửi OTP
router.post('/verify', verifyOTP);     // Xác minh OTP
router.post('/login', login);          // Đăng nhập + trả JWT

export default router; 
