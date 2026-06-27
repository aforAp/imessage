//const express = require("express");
import express from "express";
import "dotenv/config";
import { connectDB } from "./lib/db.js";
import {clerkMiddleware} from "@clerk/express";
import fs from "fs";
import path from "path";
import cors from "cors";
import job from "./lib/cron.js";
import clerkWebhook from "./webhooks/clerk.webhook.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/messages.route.js";
import {app, server} from "./lib/socket.io.js";
/*****CORS */
/* cros origin resource sharing
 when a website tried to get from the anotehr website the browser might block for the security reason
 it helps for the broswer security rules.
*/


console.log("DB URL=", process.env.DB_URL);
const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEDN_URL;
connectDB();
const publicDir = path.join(process.cwd(), "public");

//its important that you dont parse the webhook event data, it should be in the raw format
app.use("/api/webhooks/clerk", express.raw({
    type: "application/json"
}), 
clerkWebhook);

app.use(express.json()); //helps to parse the json data
app.use(cors({origin: FRONTEND_URL, credentials: true})); 
//this allows any website to call your api.
//credentials true just telling the frontend / allowing the FE tos end the cookies and headers

app.use(clerkMiddleware());

app.get("/health", (req, res) => {
    res.status(200).json({
        ok: true
    });
})

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
if(fs.existsSync(publicDir)) {

    app.use(express.static(publicDir));
     app.get("/{*any}", (req, res,next) => {
        res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
     })
}
server.listen(PORT, () =>{
    console.log("Server is up and running on port", PORT);
if (process.env.NODE_ENV === "production") 
    job.start();
});