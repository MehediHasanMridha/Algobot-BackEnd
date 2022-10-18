const mongoose = require('mongoose');

const free_courseSchema = mongoose.Schema(
    {
        title: {
            type: String,
            require: true
        },
        url: {
            type: String,
            require: true,
            unique: true
        },
        img: {
            type: String,
            require: true
        }
    }
);

module.exports = free_courseSchema;