import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import taskRoutes from "./routes/task.route.js";
import postRoutes from "./routes/post.route.js";

import "./config/firebaseConn.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/post", postRoutes);

app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
  connectDB();
});
