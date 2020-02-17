const mongoose = require('mongoose');
const config = require('./config');

const dbConnect = () => {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error: '));
    return mongoose.connect(config.url, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        poolSize: 10, // Up to 10 sockets
        connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4, // skip trying IPv6
        useUnifiedTopology: true
    });

}

module.exports = dbConnect;