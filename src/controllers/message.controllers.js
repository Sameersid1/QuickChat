import mongoose from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import Message from '../models/message.models.js'
import Chat from "../models/chat.models.js"

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
    message=await message.populate("sender","username email")    // sender ki info like kisne bheja
    message=await message.populate("chat")   //chatid bhi message me daal diya

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

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const messages=await Message.find({chat : chatId}).populate("sender","username email").populate("chat")
                                .sort({createdAt:-1}).skip((page-1)*limit).limit(limit)

    return res.status(200).json(new ApiResponse(200,messages,"Message fetched successfully"))
})
export{
    sendMessage,
    getMessages
}