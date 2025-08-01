import nodemailer from 'nodemailer';
// Import thư viện Nodemailer để gửi email từ Node.js

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});
// Thiết lập nội dung mail
export const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"MyApp 👻" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is: ${otp}`,
  });
};
