const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./db/connect');
// const User = require('./models/User');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const registerAndlogin = require('./router/registerAndLogin');
const ws = require('ws');


const app = express()
const port = 3000

app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));

app.use(express.json());
app.use(cookieParser())

app.get('/profile', async (req, res) => {
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
      console.log("username is ", username, "userId is ", userId)
      res.status(200).json({decoded});
    }
})
})

app.get('/', (req, res) => {
  // console.log('get route')
  res.send('Hello World!')
})
app.use("/", registerAndlogin);

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const wss = new ws.WebSocketServer({ server });
// console.log('wss is ', wss)
wss.on('connection', (connection, req) => {
  console.log('new ws connection');
  const cookies = req.headers.cookie;
  if (cookies) {
    const token = cookies.split(';').find(str => str.startsWith('token=')).split('=')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, userDetails) => {
      if(err) {
        console.log('error in verifying token', err);
      } else {
        connection.userId = userDetails.userId;
        connection.username = userDetails.username;
      }
    })
  }
  // const unique_user_names = [];
  [...wss.clients].forEach(client => {
    client.send(JSON.stringify([...wss.clients].map(c => ({userId: c.userId, username : c.username}))))
    // console.log('element is ', client.username)
    // append the username to the list of unique_user_names if it is not already there
    // if(!unique_user_names.includes(element.username)) {
    //   unique_user_names.push(element.username);
    // }
  });
  // console.log([...wss.clients].map(c => c.username))
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
