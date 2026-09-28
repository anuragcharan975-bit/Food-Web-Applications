const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a single reusable transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // 587 uses STARTTLS
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('\n✅ Email SMTP connection successful');
    console.log(`📧 Sender: ${process.env.EMAIL_USER}\n`);
  } catch (error) {
    console.error('\n❌ Email SMTP connection failed');
    console.error(error.message, '\n');
  }
};

const normalizeEmail = (email) => {
  if (!email) return "";
  return email.trim().toLowerCase();
};

const logSmtpResult = (info) => {
  console.log('\n----------------------------------------');
  console.log('📧 SMTP SEND MAIL RESULT');
  console.log('----------------------------------------');
  console.log({
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
    pending: info.pending,
    response: info.response,
    envelope: info.envelope
  });
  
  if (info.accepted && info.accepted.length > 0 && (!info.rejected || info.rejected.length === 0)) {
    console.log('⚠️ SMTP accepted the message. This does not guarantee Inbox delivery.');
  } else if (info.rejected && info.rejected.length > 0) {
    console.log(`❌ SMTP REJECTED the message for: ${info.rejected.join(', ')}`);
  }
  console.log('----------------------------------------\n');
};

const sendLoginNotification = async (user) => {
  try {
    if (!user || !user.email) return null;
    const email = normalizeEmail(user.email);
    const userName = user.name || "User";

    const mailOptions = {
      from: `"Zwigato Support" <${process.env.EMAIL_USER}>`,
      replyTo: process.env.EMAIL_USER,
      to: email,
      subject: 'Login Successful - Zwigato',
      text: `Hello ${userName},\n\nYour Zwigato account was successfully logged in.\n\nDate & Time: ${new Date().toLocaleString()}\nEmail: ${email}\n\nIf you did not perform this login, please contact support immediately to secure your account.\n\nRegards,\nZwigato Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #ff4757; text-align: center;">Zwigato - Login Alert</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Your Zwigato account was successfully logged in.</p>
          <p><strong>Date & Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Registered Email:</strong> ${email}</p>
          <p style="color: #747d8c; font-size: 12px; margin-top: 20px;">SECURITY WARNING: If you did not perform this login, please change your password and contact support immediately.</p>
          <br/>
          <p>Regards,<br/><strong>Zwigato Team</strong></p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logSmtpResult(info);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send login email to ${user.email}:`, error);
    return null;
  }
};

const sendOtpEmail = async (email, otp, userName = "User") => {
  try {
    if (!email) return null;
    const normalizedEmail = normalizeEmail(email);

    const mailOptions = {
      from: `"Zwigato Support" <${process.env.EMAIL_USER}>`,
      replyTo: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject: 'Password Reset OTP - Zwigato',
      text: `Hello ${userName},\n\nYour OTP for password reset is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nRegards,\nZwigato Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #ff4757; text-align: center;">Zwigato Password Reset</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>You requested to reset your password. Here is your One-Time Password (OTP):</p>
          <div style="background-color: #f1f2f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; color: #2f3542;">
            ${otp}
          </div>
          <p style="color: #747d8c; font-size: 12px; margin-top: 20px;">This OTP will expire in 10 minutes. If you didn't request a password reset, please ignore this email.</p>
          <br/>
          <p>Regards,<br/><strong>Zwigato Support Team</strong></p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logSmtpResult(info);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send OTP email to ${email}:`, error);
    return null;
  }
};

const sendEmail = async (to, subject, html) => {
  try {
    if (!to) return null;
    const normalizedTo = normalizeEmail(to);
    
    const mailOptions = {
      from: `"Zwigato Support" <${process.env.EMAIL_USER}>`,
      replyTo: process.env.EMAIL_USER,
      to: normalizedTo,
      subject: subject,
      html: html,
      text: html.replace(/<[^>]*>?/gm, '') // Very basic HTML to text fallback
    };

    const info = await transporter.sendMail(mailOptions);
    logSmtpResult(info);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send general email to ${to}:`, error);
    return null;
  }
};

module.exports = {
  verifyEmailConnection,
  sendLoginNotification,
  sendOtpEmail,
  sendEmail,
  normalizeEmail
};
