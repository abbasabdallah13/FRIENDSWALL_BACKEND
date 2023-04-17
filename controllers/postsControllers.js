import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js"

export const getAllPosts = async (req,res) => {
    try {
        const postMessages = await PostMessage.find();
        res.status(200).json(postMessages)
    } catch (error) {
        res.status(404).json({message: error.message})        
    }
}

export const createPost = async (req,res) => {
    const { creator, title, message, tags, selectedFile } = req.body;
    const newPost = new PostMessage({ creator, title, message, tags, selectedFile })
    
    try {
        await newPost.save()
        res.status(201).json(newPost)
    } catch (error) {
        res.status(409).json({message: error.message})
    }
}

export const updatePost = async (req,res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('no post with that id'); //will check if the id exists

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };
    
    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost)
}

export const deletePost = async (req,res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('no post with that id'); //will check if the id exists

    const deletedPost = await PostMessage.findByIdAndRemove(id);

    res.json({message: 'post deleted successfully' })
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    const post = await PostMessage.findById(id);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 }, { new: true });
    
    res.json(updatedPost);
}