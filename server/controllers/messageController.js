



//Get all user except the logged in user

// import { use } from "react";
import { Message } from "../models/MessageModel.js";
import { User } from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import { io,userScoketMap} from "../server.js";

export const getUserFromSidebar=async(req,res)=>{
    try{
      const userId=req.user._id;
      const filteredUser=await User.find({_id:{$ne:userId}}).select("-password");

      //count number of messages not seen

      const unseenMessage={}
      const promise=filteredUser.map(async(user)=>{
        const messages=await Message.find({senderId:user._id,reciverId:userId,seen:false})
        if(messages.length > 0){
            unseenMessage[user._id]=messages.length;
        }
      })

      await Promise.all(promise)
      res.json({success:true,users:filteredUser,unseenMessage})
    }catch(error){
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
}



//Get all message for seleced user
export const getMessage=async(req,res)=>{
    try{
   const {id:selectedUserId}=req.params;
   const myId=req.user._id;

   const messages=await Message.find({
    $or:[
        {senderId:myId,reciverId:selectedUserId},
        {senderId:selectedUserId,reciverId:myId},

    ]
   })
   await Message.updateMany({senderId:selectedUserId,reciverId:myId},{seen:true});
   res.json({success:true,messages});
    }catch(error){
  console.log(error.message)
  res.json({success:false,message:error.message});
    }
}






export const markMessageAsSeen = async (req, res) => {
  try {
    const { senderId } = req.body;       // the person who sent the messages
    const userId = req.user._id;         // logged-in user (the receiver)

    await Message.updateMany(
      { senderId, reciverId: userId, seen: false },
      { $set: { seen: true } }
    );

    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};







export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const reciverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const upload = await cloudinary.uploader.upload(image, {
        folder: "chat_images",
      });
      imageUrl = upload.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      reciverId,
      text,
      image: imageUrl,
    });

    const reciverSocketId = userScoketMap[reciverId];
    if (reciverSocketId) io.to(reciverSocketId).emit("newMessage", newMessage);

    res.json({ success: true, newMessage });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

























