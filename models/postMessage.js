import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title: String,
    message: String,
    firstName: String,
    lastName: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    likes: {
        type: [String],
        default: [],
    },
    comments:{
        type: [{
            byName: String, 
            byId:String,
            comment: String,
            createdAt: String,
            picture: String
        }],

    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const PostMessage = mongoose.model("PostMessage", postSchema)

export default PostMessage