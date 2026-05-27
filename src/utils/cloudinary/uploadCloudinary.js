import cloudinary from "../../config/cloudinary.js";
import fs from "fs";

export const uploadToCloudinary = async (filePath, options = "movent") => {
  try {
    if (!filePath) return null;

    const uploadOptions =
      typeof options === "string" ? { folder: options } : options;

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    throw error;
  }
};
