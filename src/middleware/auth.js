import admin from "firebase-admin";
import User from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.access_token) {
      return res.status(401).json({
        message: "User Not Authenticated",
      });
    } else {
      const payload = await admin
        .auth()
        .verifyIdToken(req.headers.access_token);
      req.user = payload;

      const user = await User.findOne({ googleId: payload.uid });
      if (!user) {
        return res.status(401).json({
          message: "User Not Registered",
        });
      }

      req.user.userId = user._id;
      req.user.email = user.email;
      req.user.googleId = user.googleId;

      next();
    }
  } catch (error) {
    console.log("Error in auth middleware", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
