import mongoose from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import Message from '../models/message.models.js'
import Chat from "../models/chat.models.js"
import Notification from "../models/notification.models.js"

//API = Save message 📦
//Socket = Deliver message ⚡

const sendMessage=asyncHandler(async(req,res)=>{
    const {content,chatId}=req.body

    if(!content || !chatId){
        throw new ApiError(400,"Invalid Data")
    }

    let message=await Message.create({
        sender:req.user._id,
        content,
        chat:chatId,
        deliveredTo:[req.user._id],
        seenBy:[req.user._id]
    });
    message=await message.populate("sender","username email")    // sender ki info like kisne bheja
    message=await message.populate("chat")   //chatid bhi message me daal diya

    const chat=await Chat.findByIdAndUpdate(
        chatId,
        {latestMessage:message.id},
        {new:true}
    ).populate("users")

    console.log("REQ USER: ",req.user)

    for(const user of chat.users){
        if(user._id.toString()!=req.user._id.toString()){
            await Notification.create({
                sender:req.user._id,
                receiver:user._id,
                chat:chatId,
                message:message._id
            });
            io.to(user._id.toString()).emit("new notification",{
                sender:req.user._id,
                chatId,
                message:message._id
            })
        }
    }

    const io=req.app.get("io")              //emit → send event      //on → listen for event
    io.to(chatId).emit("message received",message)

    return res.status(200).json(new ApiResponse(200,message,"Message sent successfully"))
})

const getMessages=asyncHandler(async(req,res)=>{
    const {chatId}=req.params

    if(!mongoose.Types.ObjectId.isValid(chatId)){
        throw new ApiError(400,"Invalid chatId")
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const messages=await Message.find({chat : chatId}).populate("sender","username email").populate("chat").sort({createdAt:-1}).skip((page-1)*limit).limit(limit)

    await Message.updateMany(
        {
            chat:chatId,
            sender:{$ne:req.user._id}
        },
        {
            $addToSet:{seenBy:req.user._id}
        }
    );
    return res.status(200).json(new ApiResponse(200,messages,"Message fetched successfully"))
})
export{
    sendMessage,
    getMessages
}