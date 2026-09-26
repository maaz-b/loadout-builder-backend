import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to db successfully");
  } catch (error) {
    console.log(`Error connecting to db: ${error}`);
    throw error;
  }
};

export { connectDb };
