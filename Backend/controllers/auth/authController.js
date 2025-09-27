// controllers/authController.js
const User = require("../../model/auth/authModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../../utils/generateToken");

exports.register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    res.status(201).json({ user, token: generateToken(user._id, user.role) });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.role);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development", // ✅ only true in production
        sameSite: process.env.NODE_ENV === "development" ? "None" : "Lax",
        maxAge: 1 * 60 * 60 * 1000,
      })
      .json({ user, token: token });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    res.json({ message: "delete successfully" });
  } catch (error) {
    next(error);
  }
};

exports.currentUser = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};
exports.currentUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.FetchFO = async (req, res, next) => {
  try {
    const fieldOfficers = await User.getFieldOfficers();
    res.status(200).json(fieldOfficers);
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// ✅ Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password"); // password ko hata diya for security
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
