import mongoose from "mongoose";

const teamSchema=new mongoose.Schema({
    teamName:{
        type:String,
        required:true
    },
    teamLeader:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    members:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"User",
        required:true
    },
    hackathonId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hackathon",
        required:true
    },
    gitRepoLink:{
        type:String,
        required:false,
        default:""
    },
    islocked:{
        type:Boolean,
        default:false
    },
    pendingInvites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    joinRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    todos: [{
        id: { type: String, required: true },
        text: { type: String, required: true },
        completed: { type: Boolean, default: false }
    }]
}, { timestamps: true });

const Team = mongoose.model("Team", teamSchema);

export default Team;