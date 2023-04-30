import express, { Router } from "express"
import { createPost, deletePost, getAllPosts, likePost, updatePost } from "../controllers/postsControllers.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/', getAllPosts)
router.post('/', auth,createPost)
router.patch('/:id', auth,updatePost)
router.delete('/delete/:id', auth,deletePost)
router.patch('/like/:id', auth,likePost)

export default router;