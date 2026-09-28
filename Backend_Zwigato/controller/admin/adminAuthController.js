const Admin = require("../../model/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const adminRegisterSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "Admin mobile number must be exactly 10 digits.",
    })
    .required(),
});

const createAdmin = async (req, res) => {
  try {
    const { error } = adminRegisterSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { name, email, password, phone } = req.body;

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "admin",
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.log("CREATE ADMIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Admin creation failed",
      error: error.message,
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password, phone } = req.body;

    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Admin mobile number must be exactly 10 digits.",
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email, password, or phone",
      });
    }

    console.log("Found admin:", admin);
    console.log("Req password type:", typeof password);
    console.log("Req password:", password);

    if (admin.phone && admin.phone !== phone) {
      return res.status(401).json({
        success: false,
        message: "Invalid email, password, or phone",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      admin.password
    );
    console.log("Password match:", isPasswordMatch);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET || "zwigato_admin_secret",
      {
        expiresIn: "1d",
      }
    );

    const { sendLoginNotification } = require("../../utils/sendEmail");
    sendLoginNotification(admin);

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.log("ADMIN LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Admin login failed",
      error: error.message,
    });
  }
};

module.exports = {
  createAdmin,
  adminLogin,
};