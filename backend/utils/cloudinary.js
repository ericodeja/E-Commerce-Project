import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (req, res, next) => {
  try {
    const thumbnailFile = req.files.thumbnail?.[0];
    const imageFiles = req.files.images || [];

    if (!thumbnailFile) {
      const error = new Error("Thumbnail is required");
      error.status = 400;
      return next(error);
    }

    const thumbnailResult = await cloudinary.uploader.upload(
      thumbnailFile.path,
      {
        folder: "products/thumbnails",
        fetch_format: "auto",
        quality: "auto",
      },
    );

    const imageResults = await Promise.all(
      imageFiles.map((file) => {
        return cloudinary.uploader.upload(file.path, {
          folder: "products/images",
          fetch_format: "auto",
          quality: "auto",
        });
      }),
    );

    fs.unlinkSync(thumbnailFile.path);
    imageFiles.forEach((file) => fs.unlinkSync(file.path));

    req.thumbnail = thumbnailResult.secure_url;
    req.images = imageResults.map((result) => {
      return result.secure_url;
    });

    next();
  } catch (err) {
    next(err);
  }
};
