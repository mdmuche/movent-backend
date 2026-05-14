import cloudinary from "../../config/cloudinary.js";

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;

  return cloudinary.uploader.destroy(publicId);
};
