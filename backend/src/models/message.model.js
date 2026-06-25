import mongoose from "mongoose";

const messageSchema = new Mongoose.Schema({
senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
},
receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
},
text: {
    type: String,
},
image: {
    type: String,
},
video: {
    type: String,
}

}, {timestamps: true});

const Message = mongoose.model("message", messageSchema);

export default Message;
