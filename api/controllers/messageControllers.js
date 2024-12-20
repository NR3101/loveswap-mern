import Message from "../models/Message.js";
import { getConnectedUsers, getIo } from "../socket/socket.server.js";

// send message controller
export const sendMessage = async (req, res) => {
  try {
    const { content, receiverId } = req.body;

    if (!content || !receiverId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newMessage = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      content,
    });

    // send message to receiver in real time using socket.io
    const connectedUsers = getConnectedUsers();
    const io = getIo();

    const receiverSocketId = connectedUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        message: newMessage,
      });
    }

    return res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// get conversations controller
export const getConversations = async (req, res) => {
  const { userId } = req.params;

  try {
    const conversations = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { receiver: req.user._id, sender: userId },
      ],
    }).sort("createdAt");

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Error in getConversations controller:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
