const express = require('express');
const router = express.Router();
const { register, verifyOTP, login } = require('../controllers/authController');

router.post('/register', register);    // Gửi OTP
router.post('/verify', verifyOTP);     // Xác minh OTP
router.post('/login', login);          // Đăng nhập + trả JWT

module.exports = router;
