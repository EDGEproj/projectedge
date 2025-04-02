import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport";
import { passportConfig, jwtConfig } from "./config/config.js";
import blogsController from "./controllers/blogs.js";
import usersController from "./controllers/users.js";

dotenv.config();

const app = express();

// Database connection
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => {
        console.log('Connected to MongoDB successfully');
        app.listen(process.env.PORT || 5000, () => {
            console.log("Server is running...");
        });
    })
    .catch((err) => console.log(`Failed to connect: ${err}`));

// Configuring passport and jwt
passportConfig();
jwtConfig();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
    methods: 'GET,POST,PUT,DELETE,HEAD,OPTIONS',
}));

// Routes
app.use("/api/blogs", blogsController);
app.use("/api/users", usersController);

app.get("/", (req, res) => {
    res.send("Server is running...");
});

export default app;
