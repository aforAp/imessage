import express from "express";
import { CheckAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleWare/auth.middleware.js";
const router = express.Router();

router.get("/check", protectRoute, CheckAuth);

export default router;