import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";
import { useAuthStore } from "./useAuthStore";

export const useMessageStore = create((set) => ({
  loading: true,
  messages: [],

  sendMessage: async (receiverId, content) => {
    try {
      const res = await axiosInstance.post("/messages/send", {
        receiverId,
        content,
      });

      set((state) => ({
        messages: [
          ...state.messages,
          {
            _id: Date.now(),
            sender: useAuthStore.getState().authUser._id,
            content: content,
          },
        ],
      }));
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
      console.error("Failed to send message", error);
    }
  },

  getMessages: async (userId) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get(`/messages/conversations/${userId}`);
      set({ messages: res.data.conversations });
    } catch (error) {
      console.error("Failed to get messages", error);
      set({ messages: [] });
    } finally {
      set({ loading: false });
    }
  },

  subscribeToNewMessages: () => {
    const socket = getSocket();
    socket.on("newMessage", ({ message }) => {
      set((state) => ({ messages: [...state.messages, message] }));
    });
  },

  unsubscribeFromNewMessages: () => {
    const socket = getSocket();
    socket.off("newMessage");
  },
}));
