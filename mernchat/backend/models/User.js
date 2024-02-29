const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password']
    }},{timestamps: true});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;