import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads/resumes"));
    },

    filename: function (req, file, cb) {
        cb(
            null,
            Date.now() + "-" + file.originalname.replace(/\s+/g, "")
        );
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ["application/pdf"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb("Only PDF files allowed");
};

export const uploadResume = multer({ storage, fileFilter });
