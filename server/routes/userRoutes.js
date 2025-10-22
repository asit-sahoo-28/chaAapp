import express from "express"
import { checkAuth, login, signup, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

export const userRoute=express.Router();

userRoute.post("/signup",signup);
userRoute.post("/login",login);
userRoute.put("/update-profile",protect,updateProfile);
userRoute.get("/check",protect,checkAuth);