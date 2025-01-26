import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    followers: [
      {
        type: String,
      },
    ],
    following: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
