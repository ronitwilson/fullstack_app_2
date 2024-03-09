const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    console.log("reach here");
    const {username, password} = req.body;
    const creds = {username, password};
    console.log("reach here" , creds);
    console.log("registering with details" , creds);
    const usr_obj = await User.create(creds)
    const token = await jwt.sign({userId: usr_obj._id, username: usr_obj.username}, process.env.JWT_SECRET)
    res.cookie('token', token, {sameSite:'none',secure:true}).status(201).json({id: usr_obj._id}); 
    // res.status(201).json({usr_obj});
  }
  
const login = async (req, res) => 
{
    console.log("debugg register get route"); res.send(200)
        console.log("login route")
}

module.exports = {register, login}