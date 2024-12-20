import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";
import { updateProfileSchema } from "../schemas/index.js";

// update user profile controller
export const updateProfile = async (req, res) => {
  try {
    // Validate the request body
    const validationResult = updateProfileSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: validationResult.error.errors[0].message,
      });
    }

    const { image, ...otherData } = validationResult.data;
    let updatedData = otherData;

    if (image) {
      if (image.startsWith("data:image")) {
        try {
          const uploadRes = await cloudinary.uploader.upload(image);
          updatedData.image = uploadRes.secure_url;
        } catch (error) {
          console.error("Error in cloudinary upload:", error);
          return res
            .status(401)
            .json({ success: false, message: "Failed to upload image" });
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedData, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateProfile controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
