import mongoose from "mongoose";

// function to connect to the database
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB Connection Error:", error);
    process.exit(1);
  }
};
