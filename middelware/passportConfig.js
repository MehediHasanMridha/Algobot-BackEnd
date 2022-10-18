require("dotenv").config();
const mongoose = require('mongoose');
const userSchema = require('../Schema/userSchema');
const User = mongoose.model("User", userSchema);
const JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await User.findOne({ _id: jwt_payload.id });
            console.log(user);
            if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
        } catch (error) {
            return done(error, false);
        }
        
    })
);



























// exports.initializingPassport = (passport) => {
//     passport.use(new localStrategy(async (username, password, done) => {
//         try {
//             const user = await User.findOne({ email: username });
//             if (!user) {
//                 return done(null, false);
//             }
//             if (user.password !== password) {
//                 return done(null, false);
//             }
//             return done(null, user);
            
//         } catch (error) {
//             return done(error, user);
//         }
//     }))
//     passport.serializeUser((user, done) => {
//         done(null, user.id);
//     });
//     passport.deserializeUser(async (id, done) => {
//         try {
//             const user = await User.findById(id);
//             done(null, user);
//         } catch (error) {
//             done(error, false);
//         }
//     })
// };
