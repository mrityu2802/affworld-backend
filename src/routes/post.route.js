import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { uploadPost, getPost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/", authMiddleware, uploadPost);
router.get("/", authMiddleware, getPost);

export default router;
