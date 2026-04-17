//Ye middleware request ke data ko validate karta hai
//aur agar data galat ho to controller tak jaane hi nahi deta.

import {validationResult} from "express-validator"
import { ApiError } from "../utils/ApiError.js"

export const validate=(req,res,next)=>{
    const errors=validationResult(req)
    if(errors.isEmpty()){
        return next();
    }
    console.log("❌ Validation Errors:", errors.array())
    const extractedErrors=[];
    errors.array().map((err)=>extractedErrors.push(
        {
            [err.path]:err.msg
        }
    ));
    throw new ApiError(422,"Recieved data is not valid",extractedErrors)
}