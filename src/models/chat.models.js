import mongoose,{Schema} from "mongoose"

const chatSchema=new Schema({
    isGroupChat:{
        type:Boolean,
        default:false
    },
    user:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    }
})

chatSchema.index({users:1})
const Chat=mongoose.model("Chat",chatSchema)
export default Chat