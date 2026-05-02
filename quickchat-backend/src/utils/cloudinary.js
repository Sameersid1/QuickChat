import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'
import streamifier from "streamifier";
dotenv.config()

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

// const uploadOnCloudinary=async(localFilePath,resourceType='auto')=>{
//     try{
//         if(!localFilePath)  return null;
//         const response=await cloudinary.uploader.upload(
//             localFilePath,{
//                 resource_type:resourceType
//             }
//         )
//         console.log("File uploaded on cloudinary "+response.url)
//         fs.unlinkSync(localFilePath)
//         return response
//     }catch(error){
//         console.log("Error on cloudinary ",error)
//         fs.unlinkSync(localFilePath)
//         throw error
//     }
// }

const uploadOnCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
const deleteFromCloudinary=async(publicId)=>{
    try{
        const result=await cloudinary.uploader.destroy(publicId)
        console.log("Deleted from cloudinary. PublicId ",publicId)
    }catch(error){
        console.log("Error deleting from cloudinary ",error);
        return null;
    }
}
export {uploadOnCloudinary,deleteFromCloudinary}