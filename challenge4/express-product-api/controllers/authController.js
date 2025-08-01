import db from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { sendOTP } from '../utils/mailer.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10); // Mã hóa mật khẩu
  const id = uuidv4();                            // Tạo ID ngẫu nhiên cho user
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Tạo OTP 6 chữ số
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Hết hạn sau 5 phút

//Gửi mail chứa otp
  try {
    await db.query(`
      INSERT INTO users_pending (id, name, email, password, otp_code, otp_expires_at)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [id, name, email, hashed, otp, expiresAt]);

    await sendOTP(email, otp);

    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//Xác thực 
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const result = await db.query(
      'SELECT * FROM users_pending WHERE email = $1 AND otp_code = $2',
      [email, otp]
    );
    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: 'Invalid OTP' });

    if (new Date() > user.otp_expires_at)
      return res.status(400).json({ error: 'OTP expired' });

    await db.query(
      'INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)',
      [user.id, user.name, user.email, user.password]
    );

    await db.query('DELETE FROM users_pending WHERE email = $1', [email]);

    res.json({ message: 'Account verified successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//Đăng nhập và trả về JWT

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm user đã xác thực
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1', [email]
    );
    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    // So sánh mật khẩu đã mã hóa
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    // Tạo token JWT nếu đúng
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ message: 'Login success', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

