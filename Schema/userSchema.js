const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true,
            unique: true
        },
        password: {
            type: String,
            require: true
        },
        status: {
            type: String,
            enum: ['user', 'admin'],
        },
        // tokens: [
        //     {
        //         token: {
        //             type: String,
        //             require: true
        //         }
        //     }
        // ]
    }
);

// userSchema.methods.generateAuthToken=async function () {
//     try {
//         let token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
//         this.tokens = this.tokens.concat({ token: token });
//         await this.save();
//         return token;
//     } catch (error) {
//         console.log(error);
//     }
// }


module.exports = userSchema;