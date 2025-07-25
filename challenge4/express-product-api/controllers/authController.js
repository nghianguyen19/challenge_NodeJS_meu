const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { sendOTP } = require('../utils/mailer');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const id = uuidv4();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

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

const verifyOTP = async (req, res) => {
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

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1', [email]
    );
    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ message: 'Login success', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, verifyOTP, login };
