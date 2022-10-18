const mongoose = require('mongoose');
const promoCode = mongoose.Schema(
    {
        promoCode: {
            type: String,
            required: true,
            unique: true
        },
        tk: {
            type: Number,
            required: true
        }
    }
)

module.exports = promoCode;