const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const uploadDir = path.join(__dirname, "../../uploads");
const imagesDir = path.join(uploadDir, "images");
const docsDir = path.join(uploadDir, "documents");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, imagesDir);
        } else {
            cb(null, docsDir);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});

// File filter
const fileFilter = (req, file, cb) => {
    // Allow images
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    // Allow specific docs (pdf, doc, docx) if needed in future
    // else if (file.mimetype === 'application/pdf') { ... }
    else {
        cb(new Error("Unsupported file type"), false);
    }
};

// Limits
const limits = {
    fileSize: 5 * 1024 * 1024, // 5MB limit
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits,
});

module.exports = { upload };
