import multer from "multer";

// Use memory storage so the file is not written to disk until the request creation succeeds
const storage = multer.memoryStorage();

export const uploadAttachmentsPermissions = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Only PDF files are allowed"));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB per file
    }
})