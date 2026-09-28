const User = require("../../model/user");
const bcrypt = require("bcryptjs");
const { sendEmail, normalizeEmail, sendLoginNotification } = require("../../services/emailService");

// ================= CREATE USER =================

const createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Check email already exists
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
      role,
    });

    const userData = user.toObject();
    delete userData.password;

    // Send Welcome Email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #ff4757; text-align: center;">Welcome to Zwigato! 🍔</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your account has been successfully created. We are excited to have you on board!</p>
        <p>You can now log in using your registered email: <strong>${normalizedEmail}</strong></p>
        <br/>
        <p>Regards,<br/><strong>Zwigato Team</strong></p>
      </div>
    `;
    sendEmail(normalizedEmail, "Welcome to Zwigato - Registration Successful", emailHtml);

    res.status(201).json({
      success: true,
      message: "User added successfully",
      data: userData,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add user",
      error: error.message,
    });
  }
};


// ================= GET ALL USERS =================

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get users",
      error: error.message,
    });
  }
};


// ================= GET USER BY ID =================

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get user",
      error: error.message,
    });
  }
};


// ================= UPDATE USER =================

const updateUser = async (req, res) => {
  try {
    let { name, email, phone, password, role } = req.body;

    let normalizedEmail = email;
    // Agar email change kar raha hai to check karo
    if (email) {
      normalizedEmail = normalizeEmail(email);
      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: req.params.id },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    const data = {
      name,
      email: normalizedEmail,
      phone,
      role,
    };

    // Password diya hai to hash karo
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      data,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};


// ================= DELETE USER =================

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};


// ================= LOGIN USER =================

const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const userData = user.toObject();
    delete userData.password;

    // Send login notification email (await)
    await sendLoginNotification(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// ================= EXPORT =================

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};