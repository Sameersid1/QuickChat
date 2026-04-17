import User from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"

export const verifyJWT=asyncHandler(async(req,res,next)=>{
    const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    .trim();

    if (!token) {
    return res.status(401).json({ message: "Unauthorized Request" });
  }
    console.log("Cookies:", req.cookies);
    console.log("Auth Header:", req.header("Authorization"));

    try{
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user=await User.findById(decodedToken?._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")
        if(!user){
        throw new ApiError(401,"Invalid access Token")
    }
    req.user=user
    next()
    }catch(err){
        console.log("JWT ERROR:", err.message)
        throw new ApiError(401,"Invalid access Token")
    }
})