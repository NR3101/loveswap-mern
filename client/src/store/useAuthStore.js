import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { disconnectSocket, initializeSocket } from "../socket/socket.client";

export const useAuthStore = create((set) => ({
  //initial state
  authUser: null,
  loading: false,
  checkingAuth: true,

  //actions

  // action to signup
  signup: async (signupData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post("/auth/signup", signupData);

      set({ authUser: res.data.user });
      initializeSocket(res.data.user._id);
      toast.success("Account created successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  // action to login
  login: async (loginData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post("/auth/login", loginData);

      set({ authUser: res.data.user });
      initializeSocket(res.data.user._id);
      toast.success("Logged in successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  // action to logout
  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      if (res.status === 200) {
        set({ authUser: null });
        disconnectSocket();
        toast.success("Logged out successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Something went wrong");
    }
  },

  // action to check if user is authenticated
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      set({ authUser: res.data.user });
      initializeSocket(res.data.user._id);
    } catch (error) {
      set({ authUser: null });
      console.error(error);
    } finally {
      set({ checkingAuth: false });
    }
  },

  setAuthUser: (user) => {
    set({ authUser: user });
  },
}));
