// Importing the dependancies
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport";
import bodyParser from "body-parser";

// importing the model and controllers 
import User from "./models/user.js";
import Blog from "./models/blog.js";
import usersController from "./controllers/users.js";
import blogsController from "./controllers/blogs.js";

// importing the functions from config file

import { dbConnect } from "./config/config.js";
import { passportConfig } from "./config/config.js";
import { jwtConfig } from "./config/config.js";

dotenv.config();

const app = express();

// using all the functions from Config file
dbConnect();
passportConfig();
jwtConfig();

// Other app configurations
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    credentials: true, origin: process.env.CLIENT_URL,
    methods: 'GET,POST,PUT,DELETE,HEAD,OPTIONS',
    credential: true }));

// Connecting the api urls to controllers
app.use("/api/blogs", blogsController);
app.use("/api/users", usersController);

// Starting the app
app.listen(5000, () => console.log(`Server running on port ${5000}`));

