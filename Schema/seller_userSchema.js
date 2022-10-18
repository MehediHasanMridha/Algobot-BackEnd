const mongoose = require('mongoose');

const seller_userSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            require:true
        },
        email: {
            type: String,
            require:true
        },
        shop: {
            type: String,
            require:true
        },
        img: {
            type: String,
            require:true
        },
        password: {
            type: String,
            require:true
        }
    }
);

module.exports = seller_userSchema;