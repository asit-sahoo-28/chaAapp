

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { connectDB } from "./config/db.js";
import { userRoute } from "./routes/userRoutes.js";
import { messageRouter } from "./routes/messageRoutes.js";
import { Server } from "socket.io";

dotenv.config(); // MUST be at the top

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO server
export const io = new Server(server, {
  cors: { origin: "*" },
});

// Store online users
export const userScoketMap = {};

// Socket.IO connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected:", userId);

  if (userId) userScoketMap[userId] = socket.id;

  // Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userScoketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete userScoketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userScoketMap));
  });
});

// Middleware
app.use(express.json({ limit: "10mb" })); // increase limit for images
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/auth", userRoute);
app.use("/api/message", messageRouter);


if(process.env.NODE_ENV !== "production"){
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

}
  

export default server;



