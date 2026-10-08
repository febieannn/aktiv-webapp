import { Router } from "express";
import bcrypt from "bcryptjs";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import Progress from "../models/Progress.js";

const router = Router();
router.use(auth);

router.get("/me", async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "Account not found." });
    res.json(user);
  } catch (err) { next(err); }
});

router.put("/me", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const update = {};
    if (username) update.username = username;
    if (email) update.email = email;
    if (password) {
      if (password.length < 8) return res.status(400).json({ message: "Use at least 8 characters for your password." });
      update.password = await bcrypt.hash(password, 10);
    }
    const user = await User.findByIdAndUpdate(req.userId, update, { new: true }).select("-password");
    res.json(user);
  } catch (err) { next(err); }
});

router.put("/notifications", async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, { notifications: req.body }, { new: true }).select("-password");
    res.json(user.notifications);
  } catch (err) { next(err); }
});

router.delete("/me", async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !(await bcrypt.compare(req.body.password || "", user.password)))
      return res.status(401).json({ message: "That password is incorrect." });
    await Progress.deleteMany({ user: user._id });
    await user.deleteOne();
    res.json({ message: "Account deleted." });
  } catch (err) { next(err); }
});

export default router;
