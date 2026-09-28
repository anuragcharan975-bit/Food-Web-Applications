const User = require("../../model/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendOtpEmail, normalizeEmail } = require("../../services/emailService");

const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    email = normalizeEmail(email);

    // Use an exact case-insensitive match just in case
    const user = await User.findOne({ email: new RegExp('^' + email + '$', 'i') });
    if (!user) {
      return res.status(404).json({ success: false, message: "User with this email is not registered" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash OTP before saving
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    user.resetOtp = hashedOtp;
    user.otpAttempts = 0;
    // 5 minutes expiry
    user.resetOtpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    // Use the preserved function as requested
    const emailSentInfo = await sendOtpEmail(email, otp);

    if (!emailSentInfo) {
      // Because requirement says "do not return success if email not sent"
      // Even though API shouldn't silently fail, we might want to return an error here
      console.error("Failed to send OTP email.");
      return res.status(500).json({ success: false, message: "Failed to send email. Please check configuration." });
    }

    res.status(200).json({
      success: true,
      message: "An OTP has been sent to your registered email address.",
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ success: false, message: "Failed to process request.", error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required" });

    email = normalizeEmail(email);

    const user = await User.findOne({ email: new RegExp('^' + email + '$', 'i') });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.resetOtp || !user.resetOtpExpiry) {
      return res.status(400).json({ success: false, message: "No OTP request found for this email" });
    }

    if (Date.now() > user.resetOtpExpiry) {
      return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }

    if (user.otpAttempts >= 3) {
      user.resetOtp = null;
      user.resetOtpExpiry = null;
      user.otpAttempts = 0;
      await user.save();
      return res.status(400).json({ success: false, message: "Too many failed attempts. OTP has been invalidated. Please request a new one." });
    }

    const isMatch = await bcrypt.compare(otp, user.resetOtp);
    if (!isMatch) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({ success: false, message: `Invalid OTP. You have ${3 - user.otpAttempts} attempts left.` });
    }

    // OTP is correct. Generate a temporary reset token.
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Clear OTP and set Reset Token (expires in 15 mins)
    user.resetOtp = null;
    user.resetOtpExpiry = null;
    user.otpAttempts = 0;
    user.resetToken = hashedToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      resetToken: resetToken // Send token to frontend to use in the next step
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    let { email, resetToken, newPassword } = req.body;
    
    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    email = normalizeEmail(email);

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    
    const user = await User.findOne({ 
      email: new RegExp('^' + email + '$', 'i'), 
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token. Please restart the process." });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    
    // Invalidate reset token
    user.resetToken = null;
    user.resetTokenExpiry = null;
    
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful! You can now log in."
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  forgotPassword,
  verifyOtp,
  resetPassword
};
