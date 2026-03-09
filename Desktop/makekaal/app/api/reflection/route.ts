import { connectDB } from "@/lib/mongodb"
import mongoose from "mongoose"

export async function GET() {

  await connectDB()

  const db = mongoose.connection.db!

  const questions = await db
    .collection("reflection")
    .find({})
    .toArray()

  return Response.json(questions)

}