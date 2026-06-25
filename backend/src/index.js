//const express = require("express");
import express from "express";
import "dotenv/config";
import { connectDB } from "./lib/db.js";
import {clerkMiddleware} from "@clerk/express";

/*****CORS */
/* cros origin resource sharing
 when a website tried to get from the anotehr website the browser might block for the security reason
 it helps for the broswer security rules.
*/

const app = express();

console.log("DB URL=", process.env.DB_URL);
const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEDN_URL;
connectDB();

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
app.listen(PORT, () =>{
    console.log("Server is up and running on port", PORT)});