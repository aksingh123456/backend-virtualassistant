import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existemail = await User.findOne({ email });
    if (existemail) {
      return res.status(400).json({ msg: "email already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "password must be at least 6 characters" });
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedpassword,
    });

    const token = genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000, // ✅ number, not string
      sameSite: "strict",
      secure: false,
    });

    return res.status(201).json(user);
  } catch (err) {
     console.error("Signup error details:", err); 
    return res.status(500).json({ msg: `sign up error ${err}` });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "email does not exist!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "invalid password!" });
    }

    const token = genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 15 * 24 * 60 * 60 * 1000, // ✅ fixed
      sameSite: "strict",
    });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: `login error ${err}` });
  }
};

// Logout
export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "logOut successfully" });
  } catch (error) {
    return res.status(500).json({ message: `logOut error ${error}` });
  }
};
