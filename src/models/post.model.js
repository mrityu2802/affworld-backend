import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      ref: "User",
    },
    pictureUrl: {
      type: String,
      required: true,
      trim: true,
    },
    caption: {
      type: String,
      required: false,
      trim: true,
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  }
);
postSchema.index({ googleId: 1 });

const Post = mongoose.model("Post", postSchema);
export default Post;
