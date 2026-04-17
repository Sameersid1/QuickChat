import mongoose,{Schema} from "mongoose"

const chatSchema=new Schema({
    chatName:{
        type:String,
        trim:true
    },
    isGroupChat:{
        type:Boolean,
        default:false
    },
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    avatar: {
    type: String,
    default: ""
    },
    unreadCount:{
        type:Map,
        of:Number,
        default:{}
    }
})

chatSchema.index({users:1})
const Chat=mongoose.model("Chat",chatSchema)
export default Chat