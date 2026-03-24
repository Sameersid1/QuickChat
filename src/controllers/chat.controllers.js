import Chat from '../models/chat.models.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import User from '../models/user.models.js'


const accessChat=asyncHandler(async(req,res)=>{
    const {userId}=req.body

    if(!userId){
        throw new ApiError(404,"UserId required")
    }
    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new ApiError(400,"Invalid user");
    }
    let chat=await Chat.findOne({
        isGroupChat:false,
        users:{$all:[req,User._id,userId]}
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

const getAllChats=asyncHandler(async(req,res)=>{
    const chats=await User.find({
        users:{$in:[req.user._id]}
    }).populate("users","-populate")   //returning both user current and other person
    .populate({
  path: "latestMessage",
  populate: {
    path: "sender",
    select: "username email"
  }
}).sort({updatedAt:-1})

    return res.status(200).json(new ApiResponse(200,chats,"All chats fetched successfully"))
})


export {
    accessChat,
    getAllChats,
}