import express from "express";
import { getConversationsForSideBar, getMessages, getUsersForSideBar, sendMessage } from "../controllers/message.controller.js";
import { protectRoute } from "../middleWare/auth.middleware.js";
import { upload } from "../middleWare/upload.middleware.js";
const router = express.Router();

router.use(protectRoute);
router.get("/users", getUsersForSideBar);
router.get("/conversations", getConversationsForSideBar);
router.get("/:id", getMessages);
router.post("/send/:id", upload.single("media"), sendMessage);
//todo: show this in the frontend
//upload.single will help us to send onyl the single files

export default router;