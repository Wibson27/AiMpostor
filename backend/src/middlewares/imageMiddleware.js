import { plants } from "../config/gcStorageConfig.js";
import { MulterError } from "multer";
import sharp from "sharp";

const saveImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
    const filename = `${req.user.uid}_${timestamp}.webp`;
    console.log("Uploading file:", filename);
    const blob = plants.file(
      `${req.user.uid}/${req.file.fieldname}/${filename}`
    );
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: "image/webp",
      predefinedAcl: "publicRead",
    });
    const imageSharp = await sharp(req.file.buffer)
      .webp({
        quality: 60,
      })
      .toBuffer();
    blobStream.on("error", (error) => {
      console.error("Error Saving file:", error);
      return res.status(500).json({ error: "Error Saving file." });
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${plants.name}/${blob.name}`;
      console.log("File uploaded successfully:", publicUrl);
      req.file.publicUrl = publicUrl;
      next();
    });

    blobStream.end(imageSharp);
  } catch (error) {
    console.error("Error Saving file:", error);
    return res.status(500).json({ error: "Error Saving file." });
  }
};

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File size is too large! Max 5MB allowed." });
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ error: "Unexpected field!" });
    }
    return res.status(400).json({ error: `Multer error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ error: `Error: ${err.message}` });
  }
  next();
};
export { saveImage, multerErrorHandler };
