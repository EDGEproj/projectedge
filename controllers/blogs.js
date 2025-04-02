import express from "express";
import Blog from "../models/blog.js";
import { cloudinary } from "../config/config.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Cloudinary upload function
const uploadImageToCloudinary = async (file, res) => {
    try {
        const result = await cloudinary.uploader.upload(file.buffer, {
            folder: "blogimages",
            resource_type: "image",
        });
        return result.secure_url;
    } catch (err) {
        return res.status(400).json({ message: `Error uploading image: ${err}` });
    }
};

// Get all blogs
router.get("/", async (req, res) => {
    let blog = await Blog.find();
    return res.json(blog);
});

// Get a single blog by ID
router.get('/:id', async (req, res) => {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
    }
    return res.json(blog);
});

// Create a new blog
router.post('/', upload.single("image"), async (req, res) => {
    try {
        let imageUrl = "";
        if (req.file) {
            imageUrl = await uploadImageToCloudinary(req.file, res);
        }
        await Blog.create({ ...req.body, image: imageUrl });
        return res.status(201).json({ message: 'Blog successfully created' });
    } catch (err) {
        return res.status(400).json({ message: `Bad request: ${err}` });
    }
});

// Update a blog
router.put('/:id', upload.single("image"), async (req, res) => {
    try {
        let blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        if (req.params.id !== req.body._id) {
            return res.status(400).json({ message: 'Blog ID mismatch' });
        }
        let imageUrl = blog.image;
        if (req.file) {
            imageUrl = await uploadImageToCloudinary(req.file, res);
        }
        await Blog.findByIdAndUpdate(req.params.id, { ...req.body, image: imageUrl });
        return res.status(204).json({ message: 'Blog updated successfully' });
    } catch (err) {
        return res.status(400).json({ message: `Bad request: ${err}` });
    }
});

// Delete a blog
router.delete('/:id', async (req, res) => {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
    }
    await Blog.findByIdAndDelete(req.params.id);
    return res.status(204).json({ message: 'Blog deleted successfully' });
});

export default router;
