const path = require('path');
const multer = require('multer');

const upload = multer({
    dest: "uploads/",
    limits: {fileSize: 50*1024*1024},
    storage: multer.diskStorage({
        destination: (_req, _file, cb) => {
            cb(null, "uploads/"); // Set the correct path here
        },
    }),

    fileFilter: (_req, file, cb) => {
        let ext = path.extname(file.originalname);

        if (
            ext !== '.jpg' &&
            ext !== '.jpeg' &&
            ext !== '.webp' &&
            ext !== '.png' &&
            ext !== '.mp4'
        ) {
            cb(new Error(`Unsupported file type! ${ext}`), false);
            return;
        }

        // File type is supported
        cb(null, true);
    }
});

module.exports = upload;
