const mongoose = require('mongoose');
const paid_course = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        detail: {
            type: String,
            required: true
        },
        img: {
            type: String,
            required:true
        }
    }
)

module.exports = paid_course;