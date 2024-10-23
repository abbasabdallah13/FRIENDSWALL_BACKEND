import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import UserModel from '../models/user.js'
import { defaultUserPicture } from '../Constants.js'
import PostMessage from '../models/postMessage.js'

export const signin = async(req,res)=>{
    const { email, password } = req.body;
    try {
        const existingUser = await UserModel.findOne({email})

        if(!existingUser) return res.status(409).json({error: 'User not found.'})

        const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

        if(!isPasswordCorrect) return res.status(409).json({error: "Incorrect password."})

        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, 'test', {expiresIn: '1h'})

        const loggedUser = {...existingUser._doc}
        Object.keys(existingUser._doc).forEach(key => {
            if(key === 'friends' || key === 'requests'){
                delete existingUser._doc[key];
            }
        })
        res.status(200).json([{ result: existingUser, token}, {...loggedUser}])

    } catch (error) {
        res.status(500).json({'message': 'something went wrong'})
    }
}

export const signup = async(req,res)=>{
    const { email, password, confirmPassword, firstName, lastName, country } = req.body;

    try {
        const existingUser = await UserModel.findOne({email});

        if(existingUser) return res.status(409).json({error: 'Email already exist. Try a different email.'})
        let passRegex = /(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])(?=.*[._!@\-])[A-Za-z\d._!@\-]{8,}$/
        
        if(!passRegex.test(password)) return res.status(409).json({error: 'Password should be at least 8 characters and contain at least one lowercase character, one upper case character, one number, and at least one special character (. _ ! @ -) '})
       
        if(password !== confirmPassword) return res.status(409).json({error: 'Passwords do not match'})

        const salt = bcrypt.genSaltSync(10);

        const hashedPassword = bcrypt.hashSync(password, salt);

        const result = await UserModel.create({email, password: hashedPassword, firstName: `${firstName}`, lastName: `${lastName}`, picture: defaultUserPicture, country })

        const loggedUser = {...result._doc}

        Object.keys(result._doc).forEach(key => {
            if(key === 'friends' || key === 'requests'){
                delete result._doc[key];
            }
        })
        const token = jwt.sign({email: result.email, id: result._id}, 'test', {expiresIn: '1h'})
        res.status(201).json([{result: result._doc, token}, {...loggedUser}])

    } catch (error) {
        res.status(500).json({'message': 'something went wrong'})
    }
}

export const googleSignIn = async(req,res) => {
    const { given_name, family_name, email, picture } = req.body.googleResponseObject;

    try {
        const existingUser = await UserModel.findOne({email});
        console.log(existingUser)
        if(existingUser) {
            const loggedUser = {...existingUser._doc};
            Object.keys(loggedUser).forEach(key => {
                if(key === 'friends' || key === 'requests'){
                    delete loggedUser[key];
                }
            })
            const token = jwt.sign({email, id: existingUser._id}, 'test', {expiresIn: '1h'})
            return res.status(200).json([existingUser, token, loggedUser]);
        }
        if(!existingUser){
            const newUser = await UserModel.create({firstName: given_name, lastName: family_name, email, password:'%G%O%O%G%L%E%A%C%C%O%U%N%T%',picture});
            const loggedUser = {...newUser._doc};
            Object.keys(loggedUser).forEach(key => {
                if(key === 'friends' || key === 'requests'){
                    delete loggedUser[key];
                }
            })
            const token = jwt.sign({email, id: newUser._id}, 'test', {expiresIn: '1h'})
            return res.status(200).json([existingUser, token, loggedUser]);
        }
    
} catch (error) {
    console.log(error.message)
}
}

export const getUserInfo = async(req,res) => {
    const { id } = req.params;
    try {
        const user = await UserModel.findById(id); 
        if(!user) return res.status(404).json({message: 'A user with this is ID does not exist'})
        return res.status(200).json(user)
    } catch (error) {
        console.log(error.message)
    }
}

export const getUserInfoByEmail = async(req,res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({email}); 
        return res.status(200).json(user)
    } catch (error) {
        console.log(error.message)
    }
}

export const updateUserInfo = async(req,res) => {
    const { id } = req.params;
    try {
        let user = await UserModel.findById(id);
        if(req.body.password && req.body.password !== '%G%O%O%G%L%E%A%C%C%O%U%N%T%' && user.password){
            let samePassword = bcrypt.compareSync(req.body.password, user.password);
            if(!samePassword){
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(req.body.password, salt);
                user = {...req.body, password: hashedPassword}
            }
        }else{
            user = req.body;
        }   
        const updatedUser = await UserModel.findByIdAndUpdate(id, user, {new:true});
        res.status(200).json(updatedUser)
    } catch (error) {
        console.log(error.message)
    }
}

export const addFriend = async(req,res) => {
    const { userId } = req.params;
    const loggedUser = req.body;
    try {
        const user = await UserModel.findById(userId);
        const requests = user.requests;
        const ids = requests.map(requestor => requestor._id);
        const index = ids.indexOf(loggedUser._id);
        if(index === -1){
            requests.push(loggedUser);
            const updatedUser = await UserModel.findByIdAndUpdate(userId, {requests}, {new:true});
        }
    } catch (error) {
        console.log(error)
    }
}

export const unsendFriendRequest = async(req,res) => {
    const { userId, loggedUserId } = req.params;
    try {
        const user = await UserModel.findById(userId);
        const requests = user.requests.filter(request => request._id !== loggedUserId);
        await UserModel.findByIdAndUpdate(userId, {requests:requests})
        return res.status(200);
    } catch (error) {
        console.log(error.message)
    }
}

export const acceptFriend = async(req,res) => {
    const { id } = req.params;
    let loggedUser = req.body;
    try {
        const requestSender = await UserModel.findById(id);
        const senderFriends = requestSender.friends;
        senderFriends.push(loggedUser);
        const updatedRequestSender = await UserModel.findByIdAndUpdate(id, {friends: senderFriends}, {new:true});
        loggedUser.requests = loggedUser.requests.filter(request => request._id !== id);
        loggedUser.friends.push(updatedRequestSender);
        const updatedLoggedUser = await UserModel.findByIdAndUpdate(loggedUser._id, loggedUser, {new:true})
        res.status(200).json(updatedLoggedUser);
    } catch (error) {
        console.log(error)
    }
}

export const declineFriend = async(req,res) => {
    const { id } = req.params;
    const loggedUser = req.body;
    
    try{
        
    const requests = loggedUser.requests.filter(request => request._id !== id)
    const updatedLoggedUser = await UserModel.findByIdAndUpdate(loggedUser._id, {requests}, {new:true})
    return res.status(200).json(updatedLoggedUser);

    }catch (error) {
        console.log(error);
    }
}

export const unfriend = async(req,res) => {
    const { id, loggedUserId } = req.params;
    try {
        const userA = await UserModel.findById(id)
        const friendsA = userA.friends.filter(friend => friend._id.toString() !== loggedUserId);
        const updatedUserA = await UserModel.findByIdAndUpdate(id, {friends: friendsA});
        const userB = await UserModel.findById(loggedUserId); //logged user
        const friendsB = userB.friends.filter(friend => friend._id.toString() !== String(id));
        const updatedUserB = await UserModel.findByIdAndUpdate(loggedUserId, { friends: friendsB }, {new:true});
        res.status(200).json(updatedUserB)
    } catch (error) {
        console.log(error.message)
    }
}

export const getFriendDetails = async(req,res) => {
    const { id } = req.params;
    const { page } = req.query;
    try {
        const Limit = 4;
        const startIndex = (Number(page)-1) * Limit;
        const total = await PostMessage.find({creator: id}).countDocuments();
        const posts = await PostMessage.find({creator: id}).sort({_id:-1}).limit(Limit).skip(startIndex);
        const user = await UserModel.findById(id);
        return res.status(200).json([user, {data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total/Limit)}])    
    } catch (error) {
        console.log(error.message)
    }
}