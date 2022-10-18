const mongoose = require('mongoose');

const PaidRegiForm = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    trans: {
        type: String,
        required: true
    },
    promoCode: {
        type: String,
        required: true
    }
});

module.exports = PaidRegiForm;