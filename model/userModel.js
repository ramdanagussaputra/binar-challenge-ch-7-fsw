const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: [true, 'User must have an email'],
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'User must have a password'],
    },
    username: {
        type: String,
        trim: true,
        required: [true, 'User must have a username'],
    },
    biodataId: {
        type: mongoose.Types.ObjectId,
        required: [true, 'User must have a biodata object id'],
    },
    historyId: {
        type: mongoose.Types.ObjectId,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
