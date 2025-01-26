import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
      ref: "User",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      ref: "User",
    },
    task: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "done"],
      default: "pending",
    },
  },
  { timestamps: true }
);
const Task = mongoose.model("Task", taskSchema);

export default Task;
