import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  createTask,
  deleteTask,
  getTaskByID,
  getTasks,
  updateTask,
} from "../controllers/task.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getTasks);
router.get("/:id", authMiddleware, getTaskByID);
router.post("/create", authMiddleware, createTask);
router.delete("/:id", authMiddleware, deleteTask);
router.put("/update/:id", authMiddleware, updateTask);

export default router;
