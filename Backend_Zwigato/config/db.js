const mongoose = require("mongoose");

const DbAsync = async () => {
    mongoose.connect('mongodb://127.0.0.1:27017/Food')
        .then(() => console.log('connected to Mongodb!'))
        .catch((err) => console.log('Connection error:', err));
}



module.exports = DbAsync;