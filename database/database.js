const mongoose = require('mongoose');

function load(withPassword = false) {
    mongoose.connect(withPassword ? `mongodb://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}/${process.env.DB_NAME}`
        : `mongodb://localhost/${process.env.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true }, error => {
        if(error) return console.error(error)
    });
    mongoose.connection.once('open', () =>
        console.log('[DB] connection established successfully'))
}

function getCurrentDB() {
    return mongoose.connection
}

module.exports = { load, getCurrentDB }