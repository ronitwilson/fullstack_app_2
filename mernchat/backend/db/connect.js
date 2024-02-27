const mongoose = require('mongoose');
require('dotenv').config();

const connectionString = process.env.MONGO_URI;
console.log("printing connection string", connectionString);

const connectDB = () => {
    return mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {console.log('MongoDB connected')}); 
}

module.exports = connectDB;