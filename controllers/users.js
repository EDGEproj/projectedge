// Importing the dependancies
import express from 'express';
import passport from 'passport';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Here we generate JWT token
const generateToken = (user) => {
    const payload = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    };
    const jwtOptions = {
        expiresIn: '3hr'
    };
    return jwt.sign(payload, process.env.PASSPORT_SECRET,jwtOptions);
}

// store JWT token
const setTokenCookie = (req, token) => {
        res.cookie('authToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    });
};

// Register a new user
router.post("/register", async (req, res) => {
    try {

        const user = new User({ username: req.body.username, email: req.body.email, role: req.body.role });
        await user.setPassword(req.body.password);
        await user.save();
        res.status(201).json({ message: "Registeration successfully" });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Registration failed"});
    }
});

// Loggin in a user
router.post("/login", async (req, res) => {
    try{
        const {user} = await User.authenticate()(req.body.username || req.body.email, req.body.password);
        if (user){
            const authToken = generateToken(user);
            setTokenCookie(res, authToken);
            return res.status (200).json({token: authToken});
        }
        else{
            return res.status(401).json({message: " User not found"});
        }
    } catch (err){
        console.log(err);
        return res.status(401).json(` An error occured${err}`);
    }
});

// Loggin out a user
router.get("/logout", (req, res) => {
    try{
        res.cookie('authToken','',{
            httpOnly: true, 
            secure: true,
            expires: new Date(0),
        })
        res.clearCookie('authToken');
        return res.status(200).json({ message: "Logout successful" });
    }
    catch (err){
        console.log(err);
        return res.status(400).json(` An error occured${err}`);
    }
});
export default router;