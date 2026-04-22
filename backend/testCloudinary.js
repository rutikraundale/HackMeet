import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function test() {
  console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
  console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "EXISTS" : "MISSING");
  console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "EXISTS" : "MISSING");

  try {
    const result = await cloudinary.uploader.upload("https://res.cloudinary.com/demo/image/upload/sample.jpg", {
      folder: "hackmeet/test"
    });
    console.log("Upload Success!");
    console.log("URL:", result.secure_url);
    
    // Test deletion
    const publicId = result.public_id;
    await cloudinary.uploader.destroy(publicId);
    console.log("Delete Success!");
  } catch (error) {
    console.error("Cloudinary Error:", error);
  }
}

test();
