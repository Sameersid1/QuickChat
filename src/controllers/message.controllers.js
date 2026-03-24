import mongoose from "mongoose"
import { asyncHandler } from "../utils/asyncHandler"
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import User from '../models/user.models.js'
import Message from '../models/message.models.js'


const sendMessage=asyncHandler(async(req,res)=>{
    const {content,chatId}=req.body

    if(!content || !chatId){
        throw new ApiError(400,"Invalid Data")
    }

    let message=await Message.create({
        sender:req.user._id,
        content,
        chat:chatId
    });
    message:await message.populate("sender","username email")
    message:await message.populate("chat")

    await Chat.findByIdAndUpdate(chatId,{
        latestMessage:message._id
    })

    return res.status(200).json(new ApiResponse(200,message,"Message sent successfully"))
})

const getMessages=asyncHandler(async(req,res)=>{
    const {chatId}=req.params

    if(!mongoose.Types.ObjectId.isValid(chatId)){
        throw new ApiError(400,"Invalid chatId")
    }

    const message=await Chat.find({chat : chatId}).populate("sender","username email").populate("chat")

    return res.status(200).json(new ApiResponse(200,message,"Message fetched successfully"))
})
export{
    sendMessage,
    getMessages
}