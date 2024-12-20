import { Server } from "socket.io";

let io;
// Map of connected users with their socket IDs
const connectedUsers = new Map();

// Initialize the socket server
export const initializeSocketServer = (httpServer) => {
  // Create a new socket server instance
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  // Middleware to add authentication details to the socket
  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;

    if (!userId) {
      return next(new Error("Authentication failed"));
    }

    socket.userId = userId;
    next();
  });

  // Event listener for new connections
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    connectedUsers.set(socket.userId, socket.id);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      connectedUsers.delete(socket.userId);
    });
  });
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }
  return io;
};

export const getConnectedUsers = () => {
  return connectedUsers;
};
