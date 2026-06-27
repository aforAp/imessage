import { hasImageKitConfig, uploadChatMedia } from "../lib/imageKit.js";
import { getReceiverSocketId, io } from "../lib/socket.io.js";
import { upload } from "../middleWare/upload.middleware.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export async function getUsersForSideBar(req, res) {
    try {
     const loggedInUserId = req.user._id;

     const filteredUsers = await User.find({ _id: {$ne: loggedInUserId}}).select("-clerkId");
     res.status(200).json(filteredUsers);
    }  catch (error) {
res.status(500).json({
    message: "internal server error"
})
    }
};


export async function getConversationsForSideBar(req, res) {
    try {
      const loggedInUserId = req.user._id;

     const conversations = await Message.aggregate([
        {$match: [{$or: [{senderId: loggedInUserId}]}, "$receiverId", "$senderId"]},
        {
        $group: {
            _id: {$cond: [{$eq: ["senderId", loggedInUserId]}, "receiverId", "$senderId"]},
            lastMessageAt: {$max: "$createdAt"}

        }
    },
    //3. putting the most recent conversation on the top.
    {$sort: {lastMessage: -1}},
    //4. Look up each partners user profile (come back as an array)
    {$lookup: {from: "users", localField: "_id", foreignField: "_id", as: "user"}},
    //5. Pull that profile out of the array and make it the document
    {$replaceRoot: {newRoot: {$first: "$user"}}},
    //6. Hide the private clerkId field from the result
    {$project: {clerkId: 0}}
      ]);

      res.status(200).json(conversations);
    } catch(error) {
    console.error("Error in getConversationForSideBar", error.message);
    res.status(500).json({message: "Internal server error"});
    }
};

export async function getMessages() {
    try {
        const {id: userToChat} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId},
            ]
        }).sort({createdAt: 1});

        res.status(200).json(messages);

    } catch(error) {
   console.error("error in getMessages", error.message);
   res.status(500).json({
    message: "internal server error"
   });

    }
}


export async function sendMessage(req, res) {
    try {
        const {text} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;
        let imageUrl;
        let videoUrl;

        if(req.file) {
            if(!hasImageKitConfig) {
                return res.status(500).json({
                    message: "Media upload is not configured"
                });
            }
            const url = await uploadChatMedia(req.file);

            if(req.file.mimetype.startsWith("video/")) videoUrl = url;
            else imageUrl = url;
        }

       const newMessage = new Message({
        senderId,
        receiverId,
        text,
        video: videoUrl,
        image: imageUrl,
       });
       await newMessage.save();
       //tood: realtime with socket.io
       //why socket.io when you are willing to see the realtime data need to reload the application
       //to avoid that we are going to use the socket.io
const receiverSocketId = getReceiverSocketId(receiverId);
//only send the message in realtime if user is online
if(receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
}
       res.status(201).json(newMessage);
    } catch(error) {
console.error("Error in sendMessage", error.message);
res.status(500).json({
    message: "internal server error"
});
    }
}