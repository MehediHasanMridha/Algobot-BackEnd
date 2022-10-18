const express = require('express');
const mongoose = require('mongoose');
const manage = require('./Controller/manage');    
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require("helmet");
const passport = require("passport");
const config = require("./config");
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const { port, allowedDomains } = config;
app.use(cors({ origin: allowedDomains }));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(passport.initialize());
app.use(express.static('public'));

// mongoose.connect('mongodb+srv://mehedihasan:158780mh@cluster0.izzauiq.mongodb.net/algobot?retryWrites=true&w=majority').then(() => {
//     console.log("connection is successfull");
// }).catch((e)=>{
//     console.log(e);
// });

mongoose.connect('mongodb://127.0.0.1:27017/algobot').then(() => {
    console.log("connection is successfull");
}).catch((e) => {
    console.log(e);
});
app.use('/', manage);

app.listen(port, () => {
    console.log('connect');
})