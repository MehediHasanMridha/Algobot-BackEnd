const mongoose = require('mongoose');
const optionalDataSchema = mongoose.Schema(
    {
        welcomeData: {
            type: String
        },
        detail: {
            type: String
        },
        news: {
            type: String
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
        }
    }
)

module.exports = optionalDataSchema;