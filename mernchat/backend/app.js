const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./db/connect');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const registerAndlogin = require('./router/registerAndLogin');
const ws = require('ws');
const MessagesDb = require('./models/messages');
const UserModel = require('./models/User');


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

const getUserIdFromToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, userDetails) => {
      if(err) {
        reject(err)
      } else {
        resolve(userDetails.userId)
      }
    })
  })
}



app.get('/', (req, res) => {
  // console.log('get route')
  res.send('Hello World!')
})

app.get('/messages/:userId', async (req, res) => {
  const userId = req.params.userId;
  const ourUserId = await getUserIdFromToken(req.cookies.token);
  // console.log('otherUserId is ', otherUserId)
  MessagesDb.find(
    {
      $or: [
        {sender: userId, recipient: ourUserId},
        {sender: ourUserId, recipient: userId}
      ]
      // alternative querry
      // sender: {$in: [userId, ourUserId]},
      // recipient: {$in: [userId, ourUserId]}

    }).sort({createdAt: 1}).then(messages => {
      res.json(messages)
    })
})

app.get('/userList', async (req, res) => {
  const usersList = await UserModel.find({}, { _id: 1, username: 1 })
  // console.log('usersList is ', usersList)
  // console.log('debug is ', usersList[0]._id.toString())
  res.json(usersList)
})

app.post('/logout', async (req, res) => {
  const token = await jwt.sign({userId:'', username: ''}, process.env.JWT_SECRET)
  res.cookie('token', token, {sameSite:'none',secure:true}).status(201).json({id: ''});
})

app.use("/", registerAndlogin);

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const wss = new ws.WebSocketServer({ server });
// console.log('wss is ', wss)
wss.on('connection', (connection, req) => {
  const cookies = req.headers.cookie;

  connection.on('close', () => {
    console.log('A connection was closed');
    // connection.terminate();
    [...wss.clients].forEach(client => {
      // If the body starts with an expression and not with a { is seen as a value to be returned.
      client.send(JSON.stringify({online:   [...wss.clients].map(c => ({userId: c.userId, username : c.username}))}))
    });
  });

  // read user name and pwd
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
  connection.on('message', async (message) => {
    message = JSON.parse(message.toString())
    console.log('message is ', message)
    const {recipient, text} = message;
    const messageDocu = await MessagesDb.create({sender: connection.userId, recipient, text})
    // console.log('message_doc is ', message_doc)
    // notify when someone comments
    if(recipient && text) {
      [...wss.clients].filter(client => client.userId === recipient)
      .forEach(client => {
        client.send(JSON.stringify({text, sender: connection.userId, id: messageDocu._id}))
      })
    }
  });
  // notify when someone online
  [...wss.clients].forEach(client => {
    // If the body starts with an expression and not with a { is seen as a value to be returned.
    client.send(JSON.stringify({online:   [...wss.clients].map(c => ({userId: c.userId, username : c.username}))}))
  });
  // console.log([...wss.clients].map(c => c.username))
})

// wss.on('message', (message) => {
//   console.log('message is ', message)
// })

const start = async () => {
    try {
        await connectDB();
        console.log('chat app connected to database');
    } catch (error) {
        console.log(error);
    }
  }
start()
