import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js"
import UserModel from '../models/user.js'


export const getAllPosts = async(req,res) =>{
    try {
        const posts = await PostMessage.find();
        res.status(200).json(posts)
    } catch (error) {
        console.log(error.message)
    }
}

export const getPost = async (req,res) => {
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post)
    } catch (error) {
        console.log(error.message)
    }
}

export const getAllPostsPerPage = async (req,res) => { //for paginate
    const { page } = req.query;

    try {
            const LIMIT = 8; //a number of choice to display posts per page
            const startIndex = (Number(page) - 1) * LIMIT; //get the starting index of every page
            const total = await PostMessage.countDocuments({})//in order to know the number of pages and the last page we can scroll to 
            const posts = await PostMessage.find().sort({_id:-1}).limit(LIMIT).skip(startIndex);
            //the .sort takes an object with the key to sort with and value -1 or 1 either asc or desc
            //the limit limits the number of posts returned
            //the .skip skips a certain number of documents and in this case it is the number of posts in the previous page
            res.status(200).json({data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total/LIMIT)})
    } catch (error) {
        res.status(404).json({message: error.message})        
    }
}

export const getUserPosts = async(req,res) => {
    const { id } = req.params;

    try {
        
    } catch (error) {
        
    }
}


export const search = async (req,res) => {
    const { postSearch, tags } = req.query;
    try {
            const title = new RegExp(postSearch, 'i');
            const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]})
            res.json({ data:posts })
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const createPost = async (req,res) => {
    const post = req.body;
    const newPost = new PostMessage(post)
    
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

    if(!req.userId) return res.status(404).json({message: 'Unauthenticated'});

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex(id => id === String(req.userId))

    if(index === -1){
        post.likes.push(req.userId);
    }else{
        post.likes = post.likes.filter(id => id !== String(req.userId))
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new:true});
    res.status(200).json(updatedPost);
}

export const commentOnPost = async(req,res) => {
    const { comment } = req.body;
    const { id } = req.params;
    const date = new Date()
    try {
        if(!req.userId) return res.status(404).json({message: 'Unauthenticated'});
        const oldPost = await PostMessage.findById(id)
        const userDetails = await UserModel.findById(req.userId);
        oldPost.comments.push({ byId:req.userId ,byName: `${userDetails.firstName} ${userDetails.lastName}`, comment: comment, createdAt: date, picture: userDetails.picture })
        const updatedPost = await PostMessage.findByIdAndUpdate(id, { comments: oldPost.comments }, {new:true});
        res.status(200).json(updatedPost);
    } catch (error) {
        console.log(error.message)
    }
}

export const deleteComment = async(req,res) => {
    const { commentId } = req.body;
    const { id } = req.params;
    const post = await PostMessage.findById(id);
    const comments = post.comments.filter(obj => !obj._id.equals(commentId) );
    const updatedPost = await PostMessage.findByIdAndUpdate(id, {comments: comments}, {new:true});
    res.status(200).json(updatedPost);
}