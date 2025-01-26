import express from "express";
import {
  signUp,
  loginWithCredential,
  getAuthenticatedUser,
  updateProfile,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.js";
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", loginWithCredential);
router.get("/check-auth", authMiddleware, getAuthenticatedUser);
router.put("/update-profile", authMiddleware, updateProfile);

export default router;
