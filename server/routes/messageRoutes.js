import express from "express";
import { protect } from "../middleware/auth.js";
import { getMessage, getUserFromSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";

export const messageRouter=express.Router();

messageRouter.get("/users",protect,getUserFromSidebar);
messageRouter.get("/:id",protect,getMessage);
messageRouter.get("/mark/:id",protect,markMessageAsSeen);
messageRouter.post("/send/:id",protect,sendMessage);








