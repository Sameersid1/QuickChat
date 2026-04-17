import mongoose,{Schema} from 'mongoose'

const messageSchema=new Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content:{
        type: String,
        trim: true
    },
    chat:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    deliveredTo:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    seenBy:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
},{timestamps:true})

messageSchema.index({chat:1,createdAt:-1})
const Message=mongoose.model("Message",messageSchema)
export default Message