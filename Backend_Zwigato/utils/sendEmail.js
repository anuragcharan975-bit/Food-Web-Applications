
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // 587 = false, 465 = true
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Check SMTP connection
const verifyEmailConnection = async () => {
  try {
    await transporter.verify();

    console.log('✅ Email SMTP connection successful');
    console.log(`📧 Sender: ${process.env.EMAIL_USER}`);
  } catch (error) {
    console.error('❌ Email SMTP connection failed:', error.message);
  }
};

// Login notification
const sendLoginNotification = async (user) => {
  try {
    const email = user?.email?.trim().toLowerCase();

    if (!email) {
      console.error('❌ User email is missing');
      return;
    }

    const mailOptions = {
      from: `"Zwigato Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Login Successful - Zwigato',

      text: `Hello ${user.name || 'User'},

Your Zwigato account was successfully logged in.

Date & Time: ${new Date().toLocaleString('en-IN')}

Email: ${email}

If you did not perform this login, please contact support.

Regards,
Zwigato Team`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Login email accepted by SMTP server');
    console.log(`📧 To: ${email}`);
    console.log(`📨 Message ID: ${info.messageId}`);
    console.log(`📬 Response: ${info.response}`);

    return info;
  } catch (error) {
    console.error(`❌ Failed to send login email to ${user?.email}:`);
    console.error(error.message);

    return null;
  }
};

// OTP email
const sendOtpEmail = async (email, otp) => {
  try {
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
      console.error('❌ OTP email address is missing');
      return;
    }

    const mailOptions = {
      from: `"Zwigato Support" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: 'Password Reset OTP - Zwigato',

      text: `Hello,

Your OTP for password reset is:

${otp}

This OTP is valid for 10 minutes.

Regards,
Zwigato Team`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ OTP email accepted by SMTP server');
    console.log(`📧 To: ${normalizedEmail}`);
    console.log(`📨 Message ID: ${info.messageId}`);
    console.log(`📬 Response: ${info.response}`);

    return info;
  } catch (error) {
    console.error(`❌ Failed to send OTP email to ${email}:`);
    console.error(error.message);

    return null;
  }
};

module.exports = {
  sendLoginNotification,
  sendOtpEmail,
  verifyEmailConnection,
};

