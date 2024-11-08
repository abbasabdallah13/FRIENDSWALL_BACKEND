import express, { Router } from "express"
import { getPost, createPost, deletePost, getAllPosts, search, likePost, commentOnPost, updatePost, deleteComment, getAllPostsPerPage, getFriendPostsByPage } from "../controllers/postsControllers.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/', auth, getAllPostsPerPage)
router.get('/all', auth, getAllPosts)
router.get('/search', search)
router.get('/:id', getPost)
router.get('/friend/:id', getFriendPostsByPage)
router.post('/', auth,createPost)
router.patch('/comment/:id', auth, commentOnPost)
router.patch('/comment/delete/:id', auth, deleteComment)
router.patch('/:id', auth,updatePost)
router.patch('/like/:id', auth,likePost)
router.delete('/delete/:id', auth,deletePost)

export default router;