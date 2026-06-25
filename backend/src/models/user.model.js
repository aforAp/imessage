import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkId: {
      type: String,
      required: true,
      unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: ""
        //why default empty string bcoz it will become an undefined if no empty string
    }
}, {timestamps: true});

//is member since 2015
//we will get createdAt , updatedAt we will get when we use the timestamps

const User = mongoose.model("user", userSchema);

export default User;
