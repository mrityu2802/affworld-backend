import cloudinary from "../lib/coudinary.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { v4 as uuid4 } from "uuid";
import admin from "firebase-admin";

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPass = await bcryptjs.hash(password, salt);
    const uuid = uuid4();

    const newUser = new User({
      name,
      email,
      password: hashedPass,
      googleId: uuid,
    });

    if (newUser) {
      // generate jwt token
      const additionalClaims = {
        custom_provider: "email-pass-signup",
        email: email,
      };

      const authToken = await admin
        .auth()
        .createCustomToken(newUser.googleId, additionalClaims);

      await newUser.save();
      res.status(201).json({
        access_token: authToken,
        user: {
          _id: newUser._id,
          googleId: newUser.googleId,
          name: newUser.name,
          email: newUser.email,
          profilePic: newUser.profilePic,
          createdAt: newUser.createdAt,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginWithCredential = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter your email and password" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const additionalClaims = {
      custom_provider: "email-pass-login",
      email: email,
    };

    const authToken = await admin
      .auth()
      .createCustomToken(user.googleId, additionalClaims);

    res.status(201).json({
      access_token: authToken,
      user: {
        _id: user._id,
        googleId: user.googleId,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Error in credential login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const googleLogin = async (req, res) => {
  try {
    if (!req.headers.access_token) {
      return res.status(400).json({
        message: "User not authenticated",
      });
    } else {
      const payload = await admin
        .auth()
        .verifyIdToken(req.headers.access_token);
      console.log(payload);
      const googleId = payload.uid;
      let user = await User.findOne({ googleId });
      if (user) {
        res.status(201).json({
          message: "User authenticated successfully",
          user: user,
        });
      } else {
        let user = null;
        if (payload.firebase.sign_in_provider === "google.com") {
          user = new User({
            googleId: payload.uid,
            email: payload.email,
            name: payload.name,
            profilePic: payload.picture,
          });

          await user.save();

          res.status(201).json({
            message: "User authenticated successfully",
            user: user,
          });
        }
      }
    }
  } catch (error) {
    console.log("Error in google login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAuthenticatedUser = async (req, res, next) => {
  try {
    const googleId = req.user.googleId;
    let user = await User.findOne({ googleId });
    if (user) {
      return res.status(201).json({
        user: {
          _id: user._id,
          googleId: user.googleId,
          name: user.name,
          email: user.email,
          profilePic: user.profilePic,
          createdAt: user.createdAt,
        },
        message: "User authenticated successfully",
      });
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    return next(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user.userId;
    const googleId = req.user.googleId;
    console.log(req.user);

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: `profile/${googleId}`,
    });
    console.log(uploadResponse.secure_url);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );

    res.status(200).json({
      _id: updatedUser._id,
      googleId: updatedUser.googleId,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    console.log("Error in update profile", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
