import multer from "multer";

// Configure multer to store files in memory as Buffers
const storage = multer.memoryStorage();

// Accept only image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

export default upload;
