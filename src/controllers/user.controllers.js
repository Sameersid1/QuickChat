import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js"
import User from "../models/user.models.js";
import  jwt from "jsonwebtoken";
import crypto from 'crypto'
import { emailVerificationMailContent, sendEmail,forgotPasswordMailContent } from "../utils/mail.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import bcrypt from "bcrypt"

const generateAccessAndRefreshToken=async(userId)=>{
    try{
        const user=await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    }catch(error){
        throw new ApiError(500,"Something went wrong while generating access tokens")
    }
}
const registerUser=asyncHandler(async(req,res)=>{
    const {email,username,password,fullname}=req.body

    if([fullname,email,username,password].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"All fields are required");
    } 
    const existingUser=await User.findOne({
        $or:[{username},{email}]
    })

    if(existingUser){
        throw new ApiError(400,"user with email or username already exist",[])
    }
    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing")
    }
    let avatar;
    try{
        avatar=await uploadOnCloudinary(avatarLocalPath);
        console.log("Uploaded avatar ",avatar);
    }catch(error){
        console.log("Error uploading avatar ",error);
        throw new ApiError(500,"Failed to upload the avatar")
    }
    try{
        const user=await User.create({
        email,
        password,
        username:username.toLowerCase(),
        fullname,
        avatar: avatar.url,   
        isEmailVerified:false
    })
    const {unhashedToken,hashedToken,tokenExpiry}=user.generateTemporaryToken();
    console.log("unhashed token: ",unhashedToken)
    user.emailVerificationToken=hashedToken
    user.emailVerificationExpiry=tokenExpiry

    await user.save({validateBeforeSave:false})
    await user.save({ validateBeforeSave: false });

    const checkUser = await User.findById(user._id);
    console.log("DB TOKEN:", checkUser.emailVerificationToken);
    console.log("DB EXPIRY:", checkUser.emailVerificationExpiry);

    await sendEmail({
        email:user?.email,
        subject:"Please verify your mail",
        mailgenContent:emailVerificationMailContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`
        )
    })
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailerificationExpiry"
    )
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering a user")
    }
    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                {user:createdUser},
                "User registered successfully and email verification has been sent on you email"
            )
        )
    }catch(error){
         console.log("User creation failed. ",error);
        if(avatar){
            await deleteFromCloudinary(avatar.public_id)
        }
        throw new ApiError(509,"Something went wrong while registering a user and images were deleted")
    }
})
const login=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    if(!email){
        throw new ApiError(400,"Email is required")
    }
    const user=await User.findOne({email})
    if(!user){
        throw new ApiError(400,"User does not exist")
    }
    const isPasswordValid=await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(400,"Password is incorrect")
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)
    const loggedInUser=await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    );

    //cookie

    const options={
        httpOnly:true,
        secure: process.env.NODE_ENV ==="production"
    }
    return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                    user:loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        )
})
const logoutUser=asyncHandler(async(req,res,next)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:""
            }
        },
        {
            new:true
        }
    );
    const options={
            httpOnly:true,
            secure:true
        }
    return res
        .status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)    
        .json(
            new ApiResponse(200,{},"User Logged Out")
        )
})
const getCurrentUser=asyncHandler(async(req,res)=>{
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "Current user fetched successfully"
            )
        )
})
const verifyEmail=asyncHandler(async(req,res)=>{
    let {verificationToken}=req.params;

    if(!verificationToken){
        throw new ApiError(400,"Email verification token is missing")
    }
    console.log("URL TOKEN:", verificationToken);
    let hashedToken=crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex")
    
        console.log("HASHED FROM URL:", hashedToken);
    const user=await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpiry: {$gt: Date.now()}
    })
    if(!user){
        throw new ApiError(400,"Token is invalid or expired")
    }
    user.emailVerificationToken=undefined
    user.emailVerificationExpiry=undefined
    user.isEmailVerified=true
    await user.save({validateBeforeSave: false})
    
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    isEmailVerified:true
                },
                "Email is verified"
            )
        )

})
const resendEmailVerification=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user?._id)
    if(!user){
        throw new ApiError(404,"User does not exist")
    }
    if(user.isEmailVerified){
        throw new ApiError(409,"Email is already verified")
    }
    const {unhashedToken,hashedToken,tokenExpiry}=user.generateTemporaryToken();

    user.emailVerificationToken=hashedToken
    user.emailVerificationExpiry=tokenExpiry

    user.save({validateBeforeSave:false})

    //Raw token mail me and hashed token db me

    await sendEmail({                     //send same token to the user through mail
        email:user?.email,
        subject:"Please verify your mail",
        mailgenContent:emailVerificationMailContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`
        )
    })
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Email has been sent to your EmailId"
            )
        )

})
const refreshAccessToken=asyncHandler(async(req,res)=>{
    let incomingRefreshToken=req.cookies.refreshToken||req.body.refreshToken;
    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized access")
    }
    try{
        const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        const user=await User.findById(decodedToken?._id);
        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }
        console.log("Incoming:", incomingRefreshToken)
        console.log("DB:", user?.refreshToken)
        if(incomingRefreshToken!==user?.refreshToken){
            throw new ApiError(401,"Refresh token expired")
        }
        const options={
            httpOnly:true,
            secure:true
        }
        const {accessToken,refreshToken:newRefreshToken}=generateAccessAndRefreshToken(user._id)
        user.refreshToken=newRefreshToken
        await user.save({validateBeforeSave:false})

        return res
            .status(200)
            .cookie("accessToken",accessToken,options)
            .cookie("refreshToken",newRefreshToken,options)
            .json(
                new ApiResponse(
                    200,
                    {accessToken,refreshToken:newRefreshToken},
                    "Access token refreshed"
                )
            )
    }catch(error){
        throw new ApiError(401,"Invalid refresh token")
    }
})
const forgotPasswordRequest=asyncHandler(async(req,res)=>{
    const {email}=req.body;
    const user=await User.findOne({email})

    if(!user){
        throw new ApiError(404,"User not found",[]);
    }
    const {unhashedToken,hashedToken,tokenExpiry}=user.generateTemporaryToken();
    console.log("RESET TOKEN:", unhashedToken) 
        user.forgotPasswordToken=hashedToken;
        user.forgotPasswordExpiry=tokenExpiry;

        await user.save({validateBeforeSave:false})

        await sendEmail({                     //send same token to the user through mail
        email:user?.email,
        subject:"Password Reset request",
        mailgenContent:forgotPasswordMailContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/auth/reset-password/${unhashedToken}`
        )
    });
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password reset email has been sent to your mail id"
            )
        )
})
const forgotResetPassword=asyncHandler(async(req,res)=>{
    const {resetToken}=req.params;
    const {newPassword}=req.body;

    let hashedToken=crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

    const user=await User.findOne({
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: {$gt: Date.now()}
    })
    
    if(!user){
        throw new ApiError(429,"Token is invalid or expired");
    }

    user.forgotPasswordExpiry=undefined
    user.forgotPasswordToken=undefined

    user.password=newPassword
    await user.save({validateBeforeSave:false})

    return res
        .status(200)
        .json(
            new ApiResponse(200,
                {},
                "Password reset successfully"
            )
        )
})
const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body
    const user=await User.findById(req.user?._id);

    const isPasswordValid=await user.isPasswordCorrect(oldPassword)

    if(!isPasswordValid){
        throw new ApiError(400,"Invalid old Password")
    }
    user.password=newPassword
    await user.save({validateBeforeSave:true});

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password change successfully"
            )
        )
})
const searchUser=asyncHandler(async(req,res)=>{
    const keyword=req.query.search;

    if(!keyword){
        throw new ApiError(402,"Search query is missing")
    }
    
    const users=await User.find({
        $and:[
            {_id:{$ne:req.user._id}},
            {
                $or:[
                    {username:{$regex:keyword,$options:"i"}},
                    {email:{$regex:keyword,$options:"i"}}
                ]
            }
        ]
    }).select("-password")

    res.status(200).json(new ApiResponse(200,users,"Search successful"))
})
export {registerUser,
    login,
    logoutUser,
    getCurrentUser,
    verifyEmail,
    resendEmailVerification,
    refreshAccessToken,
    forgotPasswordRequest,
    forgotResetPassword,
    changeCurrentPassword,
    searchUser
    }