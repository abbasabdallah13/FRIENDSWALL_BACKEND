import express from 'express'
import { signin, signup, getUserInfo, updateUserInfo, addFriend, acceptFriend, declineFriend, getFriendDetails, unsendFriendRequest, googleSignIn, unfriend } from '../controllers/userControllers.js';

const router = express.Router();

router.post('/signin', signin)
router.post('/signup', signup)
router.post('/google-sign-in', googleSignIn)
router.get('/user/:id', getUserInfo)
router.patch('/user/update/:id', updateUserInfo)
router.patch('/user/add/:userId', addFriend)
router.patch('/user/:userId/unfriend/:loggedUserId', unsendFriendRequest)
router.patch('/user/accept/:id', acceptFriend)
router.patch('/user/decline/:id', declineFriend)
router.patch('/user/unfriend/:id/:loggedUserId', unfriend)
router.get('/friend/:id', getFriendDetails)
export default router
