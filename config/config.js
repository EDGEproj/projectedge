// IMporting all the necessary dependancies
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import User from "../models/user.js";
import cloudinary from 'cloudinary';


dotenv.config();

// Database Connection string
export const dbConnect = async () => {
    mongoose.connect(process.env.MONGO_URI, {})
    .then((res) => console.log('Connected to mongoDB successfully'))
    .catch((err) => console.log(`Failed to connect: -${err}`));
}

// Passport.js Configuration

export const passportConfig = () =>{
    passport.initialize();
    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
};
// JWT Configuration
export const jwtConfig = () => {
    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.PASSPORT_SECRET,
    };
    const strategy = new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id);
            if (user){
                return done(null, user);
            }
            else{
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    });
    passport.use(strategy);
}
// Cloudinary configuration we are using this for image upload

export const cloudinaryConfig = () => {
    cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    }
)};
export {cloudinary};


export default { dbConnect, passportConfig, jwtConfig, cloudinaryConfig};
