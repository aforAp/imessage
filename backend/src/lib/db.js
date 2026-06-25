import mongoose from "mongoose";

export async function connectDB() {
    const MongoDB_URL = process.env.DB_URL;
    try {
       const conn = await mongoose.connect(MongoDB_URL);
       console.log("Mongodb connected");
       
    } catch(error) {
console.error("MongoDB connection error", error.message);
process.exit(1);
//1 means failed, 0 means success
    }
}
