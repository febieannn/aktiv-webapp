import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();
const sign = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const publicUser = (u) => ({ id: u._id, fullname: u.fullname, username: u.username, email: u.email });

router.post("/signup", async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) return res.status(400).json({ message: "Fill in your name, email and password." });
    if (password.length < 8) return res.status(400).json({ message: "Use at least 8 characters for your password." });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: "That email already has an account. Try logging in." });

    const user = await User.create({ fullname, email, username: email.split("@")[0], password: await bcrypt.hash(password, 10) });
    res.status(201).json({ token: sign(user), user: publicUser(user) });
  } catch (err) { next(err); }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user || !(await bcrypt.compare(password || "", user.password)))
      return res.status(401).json({ message: "Email or password is incorrect." });
    res.json({ token: sign(user), user: publicUser(user) });
  } catch (err) { next(err); }
});

export default router;
