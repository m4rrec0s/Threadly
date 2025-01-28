import multer, { Options } from "multer";
import path from "path";

export default {
  storage: multer.diskStorage({
    destination: path.join(__dirname, "..", "..", "uploads"),
    filename(request, file, callback) {
      callback(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB
  },
  fileFilter: (request, file, callback) => {
    const mimeType = ["image/jpeg", "image/png", "image/jpg", "image/gif"];

    if (!mimeType.includes(file.mimetype)) {
      callback(null, false);
    }
    callback(null, true);
  },
} as Options;
