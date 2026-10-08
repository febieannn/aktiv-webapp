import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    activityId: { type: String, required: true },
    status: { type: String, enum: ["Not started", "In progress", "Completed"], default: "Not started" },
    stepsDone: { type: Number, default: 0 },
    html: String,
    css: String,
  },
  { timestamps: true }
);
progressSchema.index({ user: 1, activityId: 1 }, { unique: true });

export default mongoose.model("Progress", progressSchema);
