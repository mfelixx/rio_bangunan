import express from "express";
import path from "path";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|webp/;
  const mimeTypes = /image\/(jpeg|jpg|png|webp)/;

  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimeTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      "Error: File upload only supports the following filetypes - " + fileTypes,
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});
const UploadSingle = upload.single("image");

router.post("/", (req, res) => {
  UploadSingle(req, res, async (err) => {
    if (err) {
      res.status(500).send({ error: err.message });
    } else if (req.file) {
      const filepath = req.file.path;
      const fileExt = path.extname(req.file.originalname).toLowerCase();
      const resizedFilePath = `uploads/resized-${Date.now()}${fileExt}`;

      const resizedImageBuffer = await sharp(filepath)
        .resize(6000, 4000)
        .toBuffer();
      fs.writeFileSync(resizedFilePath, resizedImageBuffer);

      res.status(200).send({
        msg: "File uploaded successfully",
        img: `/${resizedFilePath}`,
      });
    } else {
      res.status(400).send({ error: "File not uploaded" });
    }
  });
});
export default router;
