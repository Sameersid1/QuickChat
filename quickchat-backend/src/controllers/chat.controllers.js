import Chat from '../models/chat.models.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import mongoose from "mongoose"
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const accessChat=asyncHandler(async(req,res)=>{
    const {userId}=req.body

    if(!userId){
        throw new ApiError(400,"UserId required")
    }
    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new ApiError(400,"Invalid user");
    }
    let chat=await Chat.findOne({
        isGroupChat:false,
        users:{$all:[req.user._id,userId]}
    }).populate("users","-password")

    if(chat){
        return res.status(200).json(new ApiResponse(200,chat,"Chat fetched successfully"))
    }
    chat=await Chat.create({
        isGroupChat:false,
        users:[req.user._id,userId]
    })

    const fullChat=await Chat.findById(chat._id).populate("users","-password")

    return res.status(200).json(new ApiResponse(200,fullChat,"Chat created successfully"))
})

const deleteGroup = asyncHandler(async (req, res) => {
    const { chatId } = req.params;

    if (!chatId) {
    throw new ApiError(400, "chatId required");
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
        throw new ApiError(404, "Chat not found");
    }

    // Only admin can delete group
    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only admin can delete group");
    }

    await Chat.findByIdAndDelete(chatId);

    return res.status(200).json(
        new ApiResponse(200, null, "Group deleted successfully")
    );
});

const getAllChats=asyncHandler(async(req,res)=>{
    const chats=await Chat.find({
        users:{$in:[req.user._id]}
    }).populate("users","-password")   //returning both user current and other person
    .populate({
  path: "latestMessage",
  populate: {
    path: "sender",
    select: "username email"
  }
}).sort({updatedAt:-1})

    return res.status(200).json(new ApiResponse(200,chats,"All chats fetched successfully"))
})

const createGroupChat=asyncHandler(async(req,res)=>{
    const users = JSON.parse(req.body.users);
    const name = req.body.name;

    if(!name || !users){
        throw new ApiError(400,"Name and Users required")
    }

    let avatarUrl = "";
    if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    avatarUrl = result.secure_url;

    fs.unlinkSync(req.file.path);
    }

    const group=await Chat.create({
        chatName:name,
        isGroupChat:true,
        users:[...users,req.user._id],
        groupAdmin:req.user._id,
        avatar: avatarUrl
    })
    
    return res.status(200).json(new ApiResponse(200,group,"Group created"))
})

const addToGroup=asyncHandler(async(req,res)=>{
    const {chatId,userId}=req.body

    const chat=await Chat.findById(chatId);

    if(!chat){
        throw new ApiError(404,"Chat not found")
    }

    //only admin can add
    if(chat.groupAdmin.toString()!==req.user._id.toString()){
        throw new ApiError(403,"Only admin can add members")
    }
    const alreadyExists=chat.users.some(
        (id)=>id.toString()===userId
    );

    const updatedChat=await Chat.findByIdAndUpdate(
        chatId,
        {$addToSet:{users:userId}},
        {new:true}
    ).populate("users","-password");

    return res.status(200).json(new ApiResponse(200,updatedChat,alreadyExists?"User already in group":"User added successfully"))
})

const removeFromGroup=asyncHandler(async(req,res)=>{
    const {chatId,userId}=req.body

    const chat=await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { users: new mongoose.Types.ObjectId(userId) } },
        {new:true}
    ).populate("users","-password");
    return res.status(200).json(new ApiResponse(200,chat,"User removed"))
})

const renameGroup=asyncHandler(async(req,res)=>{
    const {chatId,name}=req.body;

    const chat=await Chat.findByIdAndUpdate(
        chatId,
        {chatName:name},
        {new:true}
    )
    return res.status(200).json(new ApiResponse(200,chat,"Group name changed"))
})
export {
    accessChat,
    getAllChats,
    createGroupChat,
    addToGroup,
    removeFromGroup,
    renameGroup,
    deleteGroup
}