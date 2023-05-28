import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    picture: String,
    bio: String,
    country: String,
    requests: {
        type: [Object],
        default: []
    },
    friends: {
        type: [Object],
        default: []
    }
})

export default mongoose.model('User', userSchema)