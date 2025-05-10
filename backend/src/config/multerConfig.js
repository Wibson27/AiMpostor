import multer from "multer";
import path from "path";
// Configure multer for image uploads
const storage = multer.memoryStorage(); // Store image in memory

const MAXFILESIZE = 5 * 1024 * 1024; // 5 MB

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname.toLowerCase()));
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images (jpeg, jpg, png) are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: MAXFILESIZE },
});

export default upload;
