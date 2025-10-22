

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import { generateToken } from "../config/utils.js";





export const signup=async(req,res)=>{
  const { fullName, email, password,bio} = req.body;
  try{
    if (!fullName || !email || !password || !bio) {
     return res.status(400).json({ success: false, message: "All fields are required" });
    
    }
    const user=await User.findOne({email});
    if(user){
      return res.json({success:false,message:"Account alredy exists"})
    }

    const salt=await bcrypt.genSalt(10);
    const hashPassword=await bcrypt.hash(password,salt);

    const newUser=await User.create({fullName,email,password:hashPassword,bio});

    const token=generateToken(newUser._id)
    res.json({success:true,userData:newUser,token,messgae:"Account created successfully"})
  }catch(error){
    console.log(error.message)
  res.json({success:false,message:error.message})
  }
}




export const login=async(req,res)=>{
  try{
     const { email, password } = req.body;
     const userData=await User.findOne({email})

     const isPasswordCorret=await bcrypt.compare(password,userData.password);
     if(!isPasswordCorret){
      return res.json({success:false,message:"Invalid credentilas"});
     }
     const token=generateToken(userData._id)
    res.json({success:true,userData,token,messgae:"Login successfully"})
  }catch(error){
     console.log(error.message)
  res.json({success:false,message:error.message})

  }
}

export const checkAuth=(req,res)=>{
  res.json({success:true,user:req.user});
}


export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic, {
        folder: "profile_pics",
      });
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};