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
      default:
        "https://res.cloudinary.com/djior6ety/image/upload/f_auto,q_auto/khfpjw08pirc7cvmfipn",
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
