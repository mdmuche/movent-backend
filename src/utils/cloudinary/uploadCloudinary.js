import cloudinary from "../../config/cloudinary.js";
import fs from "fs";

export const uploadToCloudinary = async (filePath, folder = "movent") => {
  try {
    if (!filePath) return null;

    const result = await cloudinary.uploader.upload(filePath, {
      folder,
    });

    // remove file from local storage after upload
    fs.unlinkSync(filePath);

    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    // cleanup local file if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    throw error;
  }
};
