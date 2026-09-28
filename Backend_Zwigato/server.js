require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const DbAsync = require("./config/db");

// ================= MIDDLEWARE =================

app.use(cors());

app.use(express.json());

// ================= ADMIN ROUTES =================

const adminRouter = require("./router/admin/index");

app.use("/admin", adminRouter);

// ================= FRONTEND / API ROUTES =================

const frontendRouter = require("./router/frontend/index");

app.use("/api", frontendRouter);

// ================= TEST EMAIL ENDPOINT =================
// IMPORTANT: Protect or remove this in production!
app.post("/api/test-email", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: "Email is required" });

    const mailOptions = {
      from: `"Zwigato Support" <${process.env.EMAIL_USER}>`,
      replyTo: process.env.EMAIL_USER,
      to: email,
      subject: "Test Email from Zwigato API",
      text: "This is a test email to verify SMTP delivery.",
      html: "<p>This is a test email to verify SMTP delivery.</p>"
    };

    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, 
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail(mailOptions);
    
    if (info.rejected && info.rejected.length > 0) {
      return res.status(400).json({
        success: false,
        rejected: info.rejected,
        error: "SMTP server rejected the recipient"
      });
    }

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
      message: "SMTP accepted the email"
    });

  } catch (error) {
    console.error("Test Email Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ================= UPLOADS =================

app.use("/uploads", express.static("uploads"));

// ================= SERVE FRONTEND STATIC FILES =================

app.use(express.static(path.join(__dirname, "../Frontend_Zwigato/food")));

// ================= DATABASE =================

DbAsync();

// ================= EMAIL SERVICE =================

const { verifyEmailConnection } = require("./services/emailService");
verifyEmailConnection();

// ================= SERVER =================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});