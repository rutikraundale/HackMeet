import mongoose from "mongoose";

const conversationSchema=new mongoose.Schema({
    participants:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"User",
        required:true
    },
    lastMessage:{
        type:String,
        sender:{
            type:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
            required:true
        },
        seen:{
            type:Boolean,
            default:false
        },
        
    },
    
}, { timestamps: true });
conversationSchema.index({ participants: 1 });
const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;