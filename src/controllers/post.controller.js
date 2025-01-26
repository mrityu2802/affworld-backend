import cloudinary from "../lib/coudinary.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const uploadPost = async (req, res) => {
  try {
    const { picture, caption } = req.body;
    const googleId = req.user.googleId;

    const uploadResponse = await cloudinary.uploader.upload(picture, {
      folder: `posts/${googleId}-${Date.now()}`,
    });
    console.log(uploadResponse.secure_url);
    const newPost = new Post({
      googleId,
      pictureUrl: uploadResponse.secure_url,
      caption,
    });

    const savedPost = await newPost.save();

    res
      .status(200)
      .json({ post: savedPost, message: "Post uploaded successfully" });
  } catch (error) {
    console.log("Error in post", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPost = async (req, res) => {
  try {
    const userGoogleId = req.user.googleId;

    // Find the authenticated user
    const user = await User.findOne({ googleId: userGoogleId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get posts by followers
    const followersGoogleIds = user.followers;

    const posts = await Post.find({ googleId: userGoogleId })
      .sort({ createdAt: -1 }) // Sort by most recent
      .limit(20) // Limit to 20 posts for pagination
      .populate("_id", "name googleId profilePic");


    res.status(200).json({
      message: "Post fetched successfully",
      posts,
      totalPosts: posts.length,
    });
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
