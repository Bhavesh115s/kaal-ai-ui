import mongoose from "mongoose"

const uri = process.env.MONGODB_URI!

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return

  await mongoose.connect(uri)

  console.log("MongoDB connected")
}