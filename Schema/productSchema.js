const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        category: {

            type: String,
            required: true,
        },
        img: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required:true,
        },
        qty: {
            type: Number,
            required:true,
        },
        des: {
            type: String,
            required:true,
        },
        shop: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
        }

    }
);

module.exports = productSchema;