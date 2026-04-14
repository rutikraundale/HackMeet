import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import connectDB from "./db/connection.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{
    console.log("Hackemeet app is running");
})
const PORT=process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});