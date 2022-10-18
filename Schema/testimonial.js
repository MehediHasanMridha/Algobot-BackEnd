const mongoose = require('mongoose');
const testimonial = mongoose.Schema(
    {
        author: {
            type: String,
            required: true
        },
        profession: {
            type: String,
            required: true
        },
        des: {
            type: String,
            required: true
        },
        img: {
            type: String,
            required: true
        }
    }
);
module.exports = testimonial;