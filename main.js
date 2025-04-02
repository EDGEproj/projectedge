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

import { passportConfig } from "./config/config.js";
import { jwtConfig } from "./config/config.js";

dotenv.config();

const app = express();

// using all the functions from Config file

// Database connection string
mongoose.connect(process.env.MONGO_URI, {})
.then((res) => console.log('Connected to mongoDB successfully'))
.catch((err) => console.log(`Failed to connect: -${err}`));

passportConfig();
jwtConfig();

// Other app configurations
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    credentials: true, origin: process.env.CLIENT_URL,
    methods: 'GET,POST,PUT,DELETE,HEAD,OPTIONS',
    credential: true }));

app.use(express.json());

// Connecting the api urls to controllers
app.use("/api/blogs", blogsController);
app.use("/api/users", usersController);
app.get("/", (req, res) => {
    res.send("Server is running...");
  });
// Starting the app

export default app;

