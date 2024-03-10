const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

const register = async (req, res) => {;
    const {username, password} = req.body;
    const creds = {username, password};
    console.log("registering with details" , creds);
    const salt = await bcrypt.genSalt(10)
    creds.password = await bcrypt.hash(password, salt)
    const usr_obj = await User.create(creds)
    const token = await jwt.sign({userId: usr_obj._id, username: usr_obj.username}, process.env.JWT_SECRET)
    res.cookie('token', token, {sameSite:'none',secure:true}).status(201).json({id: usr_obj._id}); 
    // res.status(201).json({usr_obj});
  }
  
const login = async (req, res) => 
{
  const {username, password} = req.body;
  if (!username | ! password) {
    return res.status(400).json({msg: "Please enter all fields"})
  }
  const user = await User.findOne({username: username})
  if (!user) {
    return res.status(400).json({msg: "User does not exist"})
  }
  isPasswordValid = user.isPasswordValid(password)
  if (!isPasswordValid) {
    return res.status(400).json({msg: "Invalid credentials"})
  }
  const token = await jwt.sign({userId: user._id, username: user.username}, process.env.JWT_SECRET)
  res.cookie('token', token, {sameSite:'none',secure:true}).status(201).json({id: user._id});
}

module.exports = {register, login}