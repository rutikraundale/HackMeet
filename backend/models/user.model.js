import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    college: {
        type: String,
        required: false
    },
    skills: {
        type: [String],
        required: false
    },
    projects: {
        type: [String],
        required: false
    },
    hackathonsParticipated: {
        type: [String],
        required: false
    },
    hackathonsWon: {
        type: [String],
        required: false
    },
    codingPlatforms: {
        type: [String],
        required: false
    },
    socialLinks: {
        type: [String],
        required: false
    },
    isProfileCompleted: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isTeamLeader: {
        type: Boolean,
        default: false
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: false
    },
    invitations:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Team",
        required:false
    },
    
        
    
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;