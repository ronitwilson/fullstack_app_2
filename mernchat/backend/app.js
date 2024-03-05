const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./db/connect');
const User = require('./models/User');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const app = express()
const port = 3000

app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));

app.use(express.json());
app.use(cookieParser())

app.get('/profile', async (req, res) => {
  console.log('profile route')
  const token = req.cookies.token;
  if(!token) {
    res.status(401).json({message: 'Unauthorized'});
    return
  }
  await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if(err) {
      res.status(401).json({message: 'Unauthorized'});
    } else {
      const userId = decoded.userId;
      const username = decoded.username;
      res.status(200).json({username});
    }
})
})

// app.get('/', (req, res) => {
//   // console.log('get route')
//   res.send('Hello World!')
// })

app.post('/register', async (req, res) => {
  const {username, password} = req.body;
  const creds = {username, password};
  console.log("reach here" , creds);
  console.log("registering with details" , creds);
  const usr_obj = await User.create(creds)
  const token = await jwt.sign({userId: usr_obj._id, username: usr_obj.username}, process.env.JWT_SECRET)
  res.cookie('token', token).status(201).json({id: usr_obj._id}); 
  // res.status(201).json({usr_obj});
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const start = async () => {
    try {
        await connectDB();
        console.log('chat app connected to database');
    } catch (error) {
        console.log(error);
    }
  }
start()