import express, { Router } from "express"
import { getPost, createPost, deletePost, getAllPosts, search, likePost, commentOnPost, updatePost, deleteComment, getAllPostsPerPage } from "../controllers/postsControllers.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/', auth, getAllPostsPerPage)
router.get('/all', auth, getAllPosts)
router.patch('/comment/:id', auth, commentOnPost)
router.patch('/comment/delete/:id', auth, deleteComment)
router.get('/search', search)
router.get('/:id', getPost)
router.post('/', auth,createPost)
router.patch('/:id', auth,updatePost)
router.delete('/delete/:id', auth,deletePost)
router.patch('/like/:id', auth,likePost)

export default router;