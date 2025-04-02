// IMporting all the necessary dependancies
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import User from "../models/user.js";
import cloudinary from 'cloudinary';


dotenv.config();


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


export default { passportConfig, jwtConfig, cloudinaryConfig};
