import express, { Router } from "express"
import { createPost, deletePost, getAllPosts, likePost, updatePost } from "../controllers/postsControllers.js";

const router = express.Router();

router.get('/', getAllPosts)
router.post('/', createPost)
router.patch('/:id', updatePost)
router.delete('/delete/:id', deletePost)
router.patch('/:id', likePost)

export default router;