import mongoose from "mongoose";

const hackathonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    teamsize: {
        type: Number,
        required: true
    },
    prizes: {
        type: [String],
        required: false
    },
    registeringUrl: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ["active", "terminated"],
        default: "active"
    }
}, { timestamps: true });

const Hackathon = mongoose.model("Hackathon", hackathonSchema);

export default Hackathon;