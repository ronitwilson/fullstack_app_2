const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

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

    UserSchema.methods.isPasswordValid = async function(password){
        isMatch =  await bcrypt.compare(password, this.password);
        console.log(isMatch);
        return isMatch;
    }
const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;