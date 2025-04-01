//importing the necessary dependancies
import express from "express";
import Blog from "../models/blog.js";
import {cloudinary} from "../config/config.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

// This function will help us to upload an image to cloudinary
const uploadImageToCloudinary = async (file) => {
    try 
    {
        const result = await cloudinary.uploader.upload(file.buffer, {
            folder: "blogimages",
            resource_type:"image",
    });
    return result.secure_url;
} catch (err){
    return res.status(400).json({message: `There was an error uploading the image ${err}`});
}
}

// This fetches a blog post
router.get("/", async (req, res) => {
    let blog = await Blog.find();
    return res.json(blog);
});

// This fetches a single blog post
router.get('/:id', async (req, res) => {
    let blog = await Blog.findById(req.params.id);
    if (!blog){
        return res.status(404).json({message: "Blog not found"});
    }
    return res.json(blog);
});

// This creates a post
router.post('/',upload.single("image"), async (req, res) => {
    try{
        let imageUrl = "";
        if (req.file){
            imageUrl = await uploadImageToCloudinary(req.file);
        }
        await Blog.create({...req.body, image: imageUrl});
        return res.status(201).json({message: 'Yay!! Blog successfully created'});
    }
    catch (err){
        return res.status(400).json({message: `Bad request ${err}`});
    }
});

// This is used to update the post
router.put('/:id',upload.single("image"), async (req, res) => {
    try{
        let blog = await Blog.findById(req.params.id);
        if(!blog){
            return res.status(404).json({message: 'No blog Found'});
        }
        if (req.params.id !== req.body._id){
            return res.status(400).json({message: `Blog ID could not be matched`});
        }
        let imageUrl = blog.image;
        if (req.file){
            imageUrl = await uploadImageToCloudinary(req.file);
        }
        await Blog.findByIdAndUpdate(req.params.id,{...req.body, image: imageUrl});
        return res.status(204).json({message: 'Yay!! Blog updated successfully'});
    }
    catch (err){
        return res.status(400).json({message: `Bad request ${err}`});
    }});

// This deletes the blog post
router.delete(':/id', async (req, res) => {
    let blog = await Blog.findById(req.params.id);
    if (!blog){
        return res.status(404).json({message: 'No blog found'});
    }
    await Blog.findByIdAndDelete(req.params.id);
    return res.status(204).json({message: 'Yay!! Blog deleted successfully'});
});

export default router;