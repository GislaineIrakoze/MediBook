import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../database/models/users.js";

// Register
export const Register = async (req, res) => {
  try {
    const { password, ...userData } = req.body;

    const existing = await User.findOne({
      where: { email: userData.email },
    });

    if (existing) {
      return res.status(409).json({ message: "Account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userAccount = await User.create({
      ...userData,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: userAccount.id,
        role: userAccount.role,
        fullname: userAccount.fullname,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: userAccount,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "Account not found. Please register.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    console.log("✓ User authenticated:", email);
    console.log("✓ JWT_SECRET length:", process.env.JWT_SECRET?.length);

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        fullname: user.fullname,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("✓ Token generated:", token.substring(0, 30) + "...");
    console.log("✓ Token will expire in: 1 day");

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });

  } catch (error) {
    console.error("❌ Login error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};