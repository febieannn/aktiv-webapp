import { Router } from "express";
import auth from "../middleware/auth.js";
import Progress from "../models/Progress.js";

const router = Router();
router.use(auth);

router.get("/", async (req, res, next) => {
  try { res.json(await Progress.find({ user: req.userId })); } catch (err) { next(err); }
});

router.put("/:activityId", async (req, res, next) => {
  try {
    const { status, stepsDone, html, css } = req.body;
    const doc = await Progress.findOneAndUpdate(
      { user: req.userId, activityId: req.params.activityId },
      { status, stepsDone, html, css },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(doc);
  } catch (err) { next(err); }
});

export default router;
