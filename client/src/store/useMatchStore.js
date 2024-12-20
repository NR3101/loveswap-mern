import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";

export const useMatchStore = create((set) => ({
  // initial state
  isLoadingMatches: false,
  isLoadingUserProfiles: false,
  matches: [],
  userProfiles: [],
  swipeFeedback: null,

  // actions
  getMatches: async () => {
    try {
      set({ isLoadingMatches: true });
      const res = await axiosInstance.get("/matches");
      set({ matches: res.data.matches });
    } catch (error) {
      set({ matches: [] });
      toast.error(error.response.data.message || "Something went wrong");
      console.error("Failed to fetch matches", error);
    } finally {
      set({ isLoadingMatches: false });
    }
  },

  getUserProfiles: async () => {
    try {
      set({ isLoadingUserProfiles: true });
      const res = await axiosInstance.get("/matches/user-profiles");
      set({ userProfiles: res.data.users });
    } catch (error) {
      set({ userProfiles: [] });
      toast.error(error.response.data.message || "Something went wrong");
      console.error("Failed to fetch user profiles", error);
    } finally {
      set({ isLoadingUserProfiles: false });
    }
  },

  swipeLeft: async (user) => {
    try {
      set({ swipeFeedback: "passed" });
      await axiosInstance.post(`/matches/swipe-left/${user._id}`);
      set((state) => ({
        userProfiles: state.userProfiles.filter(
          (profile) => profile._id !== user._id
        ),
      }));
    } catch (error) {
      toast.error("Failed to swipe left");
      console.error("Failed to swipe left", error);
    } finally {
      setTimeout(() => {
        set({ swipeFeedback: null });
      }, 1500);
    }
  },

  swipeRight: async (user) => {
    try {
      set({ swipeFeedback: "liked" });
      await axiosInstance.post(`/matches/swipe-right/${user._id}`);
      set((state) => ({
        userProfiles: state.userProfiles.filter(
          (profile) => profile._id !== user._id
        ),
      }));
    } catch (error) {
      toast.error("Failed to swipe right");
      console.error("Failed to swipe right", error);
    } finally {
      setTimeout(() => {
        set({ swipeFeedback: null });
      }, 1500);
    }
  },

  // action to subscribe to new matches
  subscribeToNewMatches: () => {
    try {
      const socket = getSocket();
      socket.on("newMatch", (newMatch) => {
        set((state) => ({
          matches: [...state.matches, newMatch],
          swipeFeedback: "matched",
        }));

        setTimeout(() => {
          set({ swipeFeedback: null });
        }, 1500);
      });
    } catch (error) {
      console.error("Failed to subscribe to new matches", error);
    }
  },

  // action to unsubscribe from new matches
  unsubscribeFromNewMatches: () => {
    try {
      const socket = getSocket();
      if (socket) {
        socket.off("newMatch");
      }
    } catch (error) {
      // Silently handle the "Socket is not initialized" error
      // This is expected during logout when socket is already disconnected
    }
  },
}));
