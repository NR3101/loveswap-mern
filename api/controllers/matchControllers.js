import User from "../models/User.js";
import { getConnectedUsers, getIo } from "../socket/socket.server.js";

// swipe right controller
export const swipeRight = async (req, res) => {
  try {
    const { likedUserId } = req.params;
    const currentUser = await User.findById(req.user.id);
    const likedUser = await User.findById(likedUserId);

    if (!likedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!currentUser.likes.includes(likedUserId)) {
      currentUser.likes.push(likedUserId);
      await currentUser.save();

      // if liked user also likes current user, then add each other to matches
      if (likedUser.likes.includes(currentUser._id)) {
        currentUser.matches.push(likedUserId);
        likedUser.matches.push(currentUser._id);
        await Promise.all([currentUser.save(), likedUser.save()]);

        // send match notification to both users in real time using socket.io
        const connectedUsers = getConnectedUsers();
        const io = getIo();

        const likedUserSocketId = connectedUsers.get(likedUserId);
        if (likedUserSocketId) {
          io.to(likedUserSocketId).emit("newMatch", {
            _id: currentUser._id,
            name: currentUser.name,
            image: currentUser.image,
          });
        }

        const currentUserSocketId = connectedUsers.get(
          currentUser._id.toString()
        );
        if (currentUserSocketId) {
          io.to(currentUserSocketId).emit("newMatch", {
            _id: likedUser._id,
            name: likedUser.name,
            image: likedUser.image,
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "User liked successfully",
      user: currentUser,
    });
  } catch (error) {
    console.error("Error in swipeRight controller:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// swipe left controller
export const swipeLeft = async (req, res) => {
  try {
    const { dislikedUserId } = req.params;
    const currentUser = await User.findById(req.user.id);
    const dislikedUser = await User.findById(dislikedUserId);

    if (!dislikedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!currentUser.dislikes.includes(dislikedUserId)) {
      currentUser.dislikes.push(dislikedUserId);
      await currentUser.save();
    }

    return res.status(200).json({
      success: true,
      message: "User disliked successfully",
      user: currentUser,
    });
  } catch (error) {
    console.error("Error in swipeLeft controller:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// get matches controller
export const getMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "matches",
      "name image"
    );

    return res.status(200).json({
      success: true,
      message: "Matches fetched successfully",
      matches: user.matches,
    });
  } catch (error) {
    console.error("Error in getMatches controller:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// get user profiles controller
export const getUserProfiles = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    const users = await User.find({
      $and: [
        { _id: { $ne: currentUser.id } },
        { _id: { $nin: currentUser.likes } },
        { _id: { $nin: currentUser.dislikes } },
        { _id: { $nin: currentUser.matches } },
        {
          gender:
            currentUser.genderPreference === "both"
              ? { $in: ["male", "female"] }
              : currentUser.genderPreference,
        },
        { genderPreference: { $in: [currentUser.gender, "both"] } },
      ],
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log("Error in getUserProfiles: ", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
