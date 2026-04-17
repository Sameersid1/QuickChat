import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Notification from "../models/notification.models.js";

const getNotification=asyncHandler(async(req,res)=>{
    const notifications=await Notification.find({
        receiver:req.user._id,
        isRead:false
    }).populate("sender","username email")

    return res.status(200).json(new ApiResponse(200,notifications,"Notification sent successfully"))
})
export {
    getNotification
}