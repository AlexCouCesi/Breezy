import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: String,
    username: String,
    email: String,
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
});

const User = mongoose.model('User', userSchema);



export default User;