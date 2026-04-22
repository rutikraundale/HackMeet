import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary Configured with Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);

/**
 * Uploads a file buffer to Cloudinary via stream
 * @param {Buffer} buffer - The image buffer from multer
 * @param {string} folder - The folder in Cloudinary to upload to
 * @returns {Promise<string>} The exact secure URL of the uploaded image
 */
export const uploadToCloudinary = (buffer, folder = "hackmeet/avatars") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) {
          resolve(result.secure_url);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export default cloudinary;
