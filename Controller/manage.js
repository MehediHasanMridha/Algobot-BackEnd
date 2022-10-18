const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const userSchema = require('../Schema/userSchema');
const FreeCourse = require('../Schema/free_courseSchema');
const paidSchema = require('../Schema/paid_courseSchema');
const PaidRegiForm = require('../Schema/paidRegiFormSchema');
const PromoCode = require('../Schema/promoCode');
const test = require('../Schema/testimonial');
const optionalDataSchema = require('../Schema/optionalDataSchema');
const OptionalData = mongoose.model("OptionalData", optionalDataSchema)
const Testimonial = mongoose.model("Testimonial", test)
const User = mongoose.model("User", userSchema);
const FCourse = mongoose.model("FreeCourse", FreeCourse);
const PCourse = mongoose.model("PCourse", paidSchema);
const PRegi = mongoose.model("PRegi", PaidRegiForm);
const Promo = mongoose.model("PromoCode", PromoCode);
require("dotenv").config();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const UPLOAD_FOLDER = "./public/course_pic";
const fs = require('fs');
const passport = require("passport");
require("../middelware/passportConfig");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_FOLDER);
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname
            .replace(fileExt, "")
            .toLowerCase()
            .split(" ")
            .join("-") + "-" + Date.now();
        cb(null, fileName + fileExt);

        console.log(fileName);
    }
});

var upload = multer({
    storage: storage,
});

//.........................add_freeCourse.................
router.post('/manage/free_course', upload.single('img'), async (req, res) => {
    try {
        await FCourse({
            title: req.body.title,
            url: req.body.url,
            img: req.file.filename,

        }).save((err) => {
            if (err) {
                fs.unlink(`./public/course_pic/${req.file.filename}`, (err) => {
                    if (err) {
                        throw new Error(err);
                    }
                });
                res.status(401).send('Url Already Taken')
            }
            else {
                res.status(200).send('Data Add Successfully');
            }
        })
    } catch (error) {
        res.send("muri kha");
    }
});


//.........................get_freeCourse...........

router.get('/free_course', async (req, res) => {
    try {
        await FCourse.find({}, (err, data) => {
            if (!err) {
                res.status(200).json(data);
            }
            else {
                throw err;
            }
        }).clone().catch(function (err) { console.log(err) });
    } catch (error) {
        console.log(error);
    }
});


//.........................get_Specific_freeCourse...........

router.get('/freeCourse/:id', async (req, res) => {
    try {
        await FCourse.findById({ _id: req.params.id }, (err, data) => {
            if (!err) {
                res.status(200).json(data);
            }
            else {
                res.send('there was server side error');
            }
        })
    } catch (error) {
        console.log(error);
    }
});


//......................edit freeCourse...................

router.put('/update/free_course/:id', upload.single('img'), async (req, res) => {
    try {
        const find = await FCourse.findById({ _id: req.params.id });
        if (req.file === undefined) {
            await FCourse.findByIdAndUpdate({ _id: req.params.id }, {
                $set: {
                    title: req.body.title,
                    url: req.body.url,
                }
            },
                {
                    new: true,
                    useFindAndModify: false,
                },
                (err, doc) => {
                    if (!err) {
                        res.status(200).send("Data Update Successfully")
                    }
                    else {
                        res.status(401).send("Data Not Update");
                    }
                });
        }
        else {
            fs.unlink(`./public/course_pic/${find.img}`, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            await FCourse.findByIdAndUpdate({ _id: req.params.id }, {
                $set: {
                    title: req.body.title,
                    url: req.body.url,
                    img: req.file.filename
                }
            },
                {
                    new: true,
                    useFindAndModify: false,
                },
                (err, doc) => {
                    if (!err) {
                        res.status(200).send("Data Update Successfully")
                    }
                    else {
                        res.status(401).send("Data Not Update");
                    }
                });
        }
    }
    catch (error) {
        console.log(error);
    }
});

//............................Delete_free_course.........................
router.delete('/delete/:id', async (req, res) => {
    try {
        fs.unlink(`./public/course_pic/${req.body.img}`, (err) => {
            if (err) {
                console.log(err);
            }
        });
        await FCourse.deleteOne({ _id: req.params.id }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.status(200).send("Successfuly Delete");
            }
        });

    } catch (error) {

    }
});


//...........................Add_paid_Course...................
router.post('/manage/paid_course', upload.single('img'), async (req, res) => {
    try {
        await PCourse({
            title: req.body.title,
            price: req.body.price,
            detail: req.body.des,
            img: req.file.filename

        }).save((err) => {
            if (err) {
                res.status(401).send('Data Not Add Successfully');
            }
            else {
                res.status(200).send('Data Add Successfully');
            }
        })
    } catch (error) {
        res.send("muri kha");
    }
});


//...........................Get_paid_course.......................
router.get('/paid_course', async (req, res) => {
    try {
        await PCourse.find({}, (err, data) => {
            if (!err) {
                res.status(200).json(data);
            }
            else {
                throw err;
            }
        }).clone().catch(function (err) { console.log(err) });
    } catch (error) {
        console.log(error);
    }
});

//......................edit paidCourse...................
router.put('/update/arnab/:id', upload.single('img'), async (req, res) => {
    try {
        const find = await PCourse.findById({ _id: req.params.id });
        if (req.file === undefined) {
            await PCourse.findByIdAndUpdate({ _id: req.params.id }, {
                $set: {
                    title: req.body.title,
                    price: req.body.price,
                    detail: req.body.des,
                }
            },
                {
                    new: true,
                    useFindAndModify: false,
                },
                (err, doc) => {
                    if (!err) {
                        res.status(200).send("Data Update Successfully")
                    }
                    else {
                        res.status(401).send("Data Not Update");
                    }
                });
        }
        else {
            fs.unlink(`./public/course_pic/${find.img}`, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            await PCourse.findByIdAndUpdate({ _id: req.params.id }, {
                $set: {
                    title: req.body.title,
                    price: req.body.price,
                    detail: req.body.des,
                    img: req.file.filename
                }
            },
                {
                    new: true,
                    useFindAndModify: false,
                },
                (err, doc) => {
                    if (!err) {
                        res.status(200).send("Data Update Successfully")
                    }
                    else {
                        res.status(401).send("Data Not Update");
                    }
                });
        }
    }
    catch (error) {
        console.log(error);
    }
});

//............................Delete_paid_course.........................
router.delete('/delete_paid/:id', async (req, res) => {
    try {
        fs.unlink(`./public/course_pic/${req.body.img}`, (err) => {
            if (err) {
                console.log(err);
            }
        });
        await PCourse.deleteOne({ _id: req.params.id }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.status(200).send("Successfully Delete");
            }
        });

    } catch (error) {

    }
});

//....................getSpecific_paid_course......................

router.get('/paid_course/:id', async (req, res) => {
    try {
        await PCourse.findById({ _id: req.params.id }, (err, data) => {
            if (!err) {
                res.status(200).json(data);
            }
            else {
                res.send('there was server side error');
            }
        })
    } catch (error) {
        console.log(error);
    }
});


//.............................Create user Account..................

router.post('/signup', async (req, res) => {
    try {
        if (req.body.Full_name && req.body.Email && req.body.Password) {
            if (req.body.Password == req.body.Confirm_Password) {
                const hashedPassword = await bcrypt.hash(req.body.Password, 10);
                await User({
                    userName: req.body.Full_name,
                    email: req.body.Email,
                    password: hashedPassword,
                    status: 'user'

                }).save((err) => {
                    if (err) {
                        console.log(err);
                        res.status(401).send('This Email Address Already Taken');
                    }
                    else {
                        res.status(200).send('SignUp Successfully');
                    }
                })
            }
            else {
                res.status(401).send('Password and Confirm Password are Not Same');
            }
        }
        else {
            res.status(401).send('Please Fill The All Filed');
        }
    } catch (error) {
        res.send('murikha');
        console.log(error);
    }
});

//............................Login user................................


router.post('/login', async (req, res) => {
    try {
        const userName = await User.findOne({ email: req.body.Email });
        if (userName) {
            const vaildPassword = await bcrypt.compare(req.body.Password, userName.password);
            if (vaildPassword) {
                const payload = {
                    email: userName.email,
                    id: userName._id
                };
                const token = jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: '24h'
                });
                res.status(200).json({
                    "access_token": "Bearer " + token,
                    "success": "Login Successful!"
                })

            }
            else {
                res.status(401).send("Password is Incorrect");
            }
        }
        else {
            res.status(401).send("Email is Invalid Please Sign Up");
        }
    } catch (error) {

    }
});

//............................Authenticate_admin....................

router.get('/auth', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        // console.log(req.user);
        await User.findById({ _id: req.user._id }, (err, data) => {
            if (!err) {
                res.status(200).json(data);
            }
            else {
                res.send('there was server side error');
            }
        })
    } catch (error) {

    }
})

//........................Admin_check............................
router.get('/jwtoken', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        await User.findById({ _id: req.user._id }, (err, data) => {
            if (!err) {
                if (data.status == 'admin') {
                    res.send(true);
                }
                else if (data.status == 'user') {
                    res.send(false);
                }
            }
            else {
                res.send('there was server side error');
            }
        })
    } catch (error) {
        console.log(error);
    }
})

//......................all user get...................

router.get('/manage', async (req, res) => {
    try {
        await User.find({}, (err, data) => {
            if (!err) {
                res.status(200).json(data);
            }
            else {
                throw err;
            }
        }).clone().catch(function (err) { console.log(err) });
    } catch (error) {
        console.log(error);
    }
});


//......................specific user get...................

router.get('/manage/:id', async (req, res) => {
    try {
        await User.findById({ _id: req.params.id }, (err, data) => {
            if (!err) {
                res.status(200).json(data);
            }
            else {
                res.send('there was server side error');
            }
        })
    } catch (error) {
        console.log(error);
    }
});


//......................edit admin...................

router.put('/admin/:id', async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id });
        console.log(req.body.password === user.password);
        if (req.body.password === user.password) {
            await User.findByIdAndUpdate({ _id: req.params.id }, {
                $set: {
                    userName: req.body.userName,
                    email: req.body.email,
                }
            },
                {
                    new: true,
                    useFindAndModify: false,
                },
                (err, doc) => {
                    if (!err) {
                        res.status(200).send("Data Update Successfully")
                    }
                    else {
                        res.send("Data Not Update");
                    }
                });
        }
        else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await User.findByIdAndUpdate({ _id: req.params.id }, {
                $set: {
                    userName: req.body.userName,
                    email: req.body.email,
                    password: hashedPassword
                }
            },
                {
                    new: true,
                    useFindAndModify: false,
                },
                (err, doc) => {
                    if (!err) {
                        res.status(200).send("Data Update Successfully")
                    }
                    else {
                        res.send("Data Not Update");
                    }
                });
        }
    }
    catch (error) {
        console.log(error);
    }
});


//..................delete user............
router.delete('/manage/:id', async (req, res) => {
    try {
        await User.deleteOne({ _id: req.params.id }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.status(200).send("Successfuly Delete");
            }
        });
    } catch (error) {

    }
});



//................Add_Admin..............

router.post('/manage/addAdmin', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await User({
            userName: req.body.full_name,
            email: req.body.email,
            password: hashedPassword,
            status: 'admin'

        }).save((err) => {
            if (err) {
                console.log(err);
                res.status(401).send('This Email Address Already Taken');
            }
            else {
                res.status(200).json({ add: 'SignUp Successfully' });
            }
        })
    } catch (error) {
        res.send('murikha');
        console.log(error);
    }
});



//........................paid_course_regi......................
router.post('/paidRegi/', async (req, res) => {
    try {
        await PRegi({
            name: req.body.name,
            title: req.body.title,
            email: req.body.Email,
            phone: req.body.phone,
            trans: req.body.transId,
            promoCode: req.body.promoCode
        }).save((err) => {
            if (err) {
                res.status(401).send('Registration Not Successfully');
            }
            else {
                res.status(200).send('Successfully Registration');
            }
        })
    } catch (error) {
        console.log(error);
    }
});



//........................paid_course_regi_user_get......................

router.get('/paidRegi/get', async (req, res) => {
    try {
        await PRegi.find({}, (err, data) => {
            if (!err) {
                res.status(200).json(data);
            }
            else {
                console.log(err);
            }
        })
    } catch (error) {
        console.log(error);
    }
});



//........................paid_course_regi_user_Delete......................
router.delete('/paidRegi/:id', async (req, res) => {
    try {
        await PRegi.deleteOne({ _id: req.params.id }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.status(200).send("Successfuly Delete");
            }
        });
    } catch (error) {

    }
});

//........................Add_PromoCode......................
router.post('/manage/addPromo', async (req, res) => {
    try {
        await Promo({
            promoCode: req.body.promoCode,
            tk: req.body.tk
        }).save((err) => {
            if (err) {
                res.status(401).send('PromoCode is Already Exits');
            }
            else {
                res.status(200).send('Successfully Add');
            }
        })
    } catch (error) {
        console.log(error);
    }
});

//........................Get_PromoCode......................
router.get('/get/promo', async (req, res) => {
    try {
        await Promo.find({}, (err, data) => {
            if (!err) {
                res.status(200).json(data);
            }
            else {
                console.log(err);
            }
        })
    } catch (error) {
        console.log(error);
    }
});

//........................Get_Specific_PromoCode......................
router.get('/get/promo/:id', async (req, res) => {
    try {
        await Promo.findById({ _id: req.params.id }, (err, data) => {
            if (!err) {
                res.status(200).json(data);
            }
            else {
                console.log(err);
            }
        })
    } catch (error) {
        console.log(error);
    }
});

//........................Edit_PromoCode......................
router.put('/update/promo/:id', async (req, res) => {
    try {
        await Promo.findByIdAndUpdate({ _id: req.params.id }, {
            $set: {
                promoCode: req.body.promoCode,
                tk: req.body.tk
            }
        },
            {
                new: true,
                useFindAndModify: false,
            },
            (err, doc) => {
                if (!err) {
                    res.status(200).send("Data Update Successfully")
                }
                else {
                    res.status(401).send("Data Not Update");
                }
            });
    } catch (error) {
        console.log(error);
    }
});

//........................Delete_PromoCode......................
router.delete('/manage/promo/:id', async (req, res) => {
    try {
        await Promo.deleteOne({ _id: req.params.id }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.status(200).send("Successfuly Delete");
            }
        });
    } catch (error) {

    }
});


//........................Check_PromoCode......................
router.post('/check/promoCode', async (req, res) => {
    try {
        const promo = await Promo.findOne({ promoCode: req.body.promoCode });
        if (promo) {
            res.send(promo);
        }
        else {
            res.send('PromoCode is Wrong');
        }

    } catch (error) {
        console.log(error);
    }
});

//.............................add_testimonial.....................
router.post('/manage/addtestimonial', upload.single('img'), async (req, res) => {
    try {
        await Testimonial({
            author: req.body.author,
            profession: req.body.profession,
            des: req.body.des,
            img: req.file.filename
        }).save((err) => {
            if (err) {
                console.log(err);
                res.status(401).send('Server Error');
            }
            else {
                res.status(200).send('Successfully Add');
            }
        })
    } catch (error) {
        console.log(error);
    }
});


//.............................get_testimonial.....................
router.get('/testimonial/gettestimonial', async (req, res) => {
    try {
        await Testimonial.find({}, (err, data) => {
            if (!err) {
                res.status(200).json(data);
            }
            else {
                console.log(err);
            }
        })
    } catch (error) {
        console.log(error);
    }
});

//.............................get_Specific_testimonial.....................
router.get('/testimonial/:id', async (req, res) => {
    try {
        await Testimonial.findById({ _id: req.params.id }, (err, data) => {
            if (!err) {
                res.status(200).json(data);
            }
            else {
                console.log(err);
            }
        })
    } catch (error) {
        console.log(error);
    }
});

//......................edit testimonial...................
router.put('/update/testimonial/:id', upload.single('img'), async (req, res) => {
    try {
        const find = await Testimonial.findById({ _id: req.params.id });
        if (req.file === undefined) {
            await Testimonial.findByIdAndUpdate({ _id: req.params.id }, {
                $set: {
                    author: req.body.author,
                    profession: req.body.profession,
                    des: req.body.des,
                }
            },
                {
                    new: true,
                    useFindAndModify: false,
                },
                (err, doc) => {
                    if (!err) {
                        res.status(200).send("Data Update Successfully")
                    }
                    else {
                        res.status(401).send("Data Not Update");
                    }
                });
        }
        else {
            fs.unlink(`./public/course_pic/${find.img}`, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            await Testimonial.findByIdAndUpdate({ _id: req.params.id }, {
                $set: {
                    author: req.body.author,
                    profession: req.body.profession,
                    des: req.body.des,
                    img: req.file.filename
                }
            },
                {
                    new: true,
                    useFindAndModify: false,
                },
                (err, doc) => {
                    if (!err) {
                        res.status(200).send("Data Update Successfully")
                    }
                    else {
                        res.status(401).send("Data Not Update");
                    }
                });
        }
    }
    catch (error) {
        console.log(error);
    }
});

//.............................delete_testimonial.....................
router.delete('/manage/deletetestimonial/:id', async (req, res) => {
    try {
        fs.unlink(`./public/course_pic/${req.body.img}`, (err) => {
            if (err) {
                console.log(err);
            }
        });
        await Testimonial.deleteOne({ _id: req.params.id }, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.status(200).send("Successfully Delete");
            }
        });

    } catch (error) {
        console.log(error);
    }
});

//................add_optionalData...................
router.post('/add/optionalData', upload.single('img'), async (req, res) => {
    try {
        await OptionalData({
            welcomeData: req.body.welcomeData,
            detail: req.body.process,
            news: req.body.news,
            status: 'active'
        }).save((err) => {
            if (err) {
                console.log(err);
                res.status(401).send('Server Error');
            }
            else {
                res.status(200).send('Successfully Add');
            }
        })
    } catch (error) {
        console.log(error);
    }
});

//................get_optionalData...................
router.get('/get/optionalData', async (req, res) => {
    try {
        await OptionalData.find({}, (err, data) => {
            if (!err) {
                res.status(200).json(data);
            }
            else {
                console.log(err);
            }
        })
    } catch (error) {
        console.log(error);
    }
});

//................get_byid__optionalData...................
router.get('/getBYid/optionalData', async (req, res) => {
    try {
        await OptionalData.findById({ _id: '6340dea71091969a9450cd4a' }, (err, data) => {
            if (!err) {
                res.status(200).json(data);
            }
            else {
                console.log(err);
            }
        })
    } catch (error) {
        console.log(error);
    }
});


//................get_Specific_optionalData...................
router.get('/optionalData/:id', async (req, res) => {
    try {
        await OptionalData.findById({ _id: req.params.id }, (err, data) => {
            if (!err) {
                res.status(200).json(data);
            }
            else {
                console.log(err);
            }
        })
    } catch (error) {
        console.log(error);
    }
});


//................edit_Status_optionalData...................
router.put('/optionalData/:status/:id', async (req, res) => {
    try {
        await OptionalData.findByIdAndUpdate({ _id: req.params.id }, {
            $set: {
                status: req.params.status
            }
        },
            {
                new: true,
                useFindAndModify: false,
            },
            (err, doc) => {
                if (!err) {
                    res.status(200).json("Data Update")
                }
                else {
                    res.status(401).send("Data Not Update");
                }
            });
    } catch (error) {
        console.log(error);
    }
});

//................edit_optionalData...................
router.put('/edit/optionalData/:id', async (req, res) => {
    try {
        await OptionalData.findByIdAndUpdate({ _id: req.params.id }, {
            $set: {
                welcomeData: req.body.welcomeData,
                detail: req.body.detail,
                news: req.body.news
            }
        },
            {
                new: true,
                useFindAndModify: false,
            },
            (err, doc) => {
                if (!err) {
                    res.status(200).json("Data Update")
                }
                else {
                    res.status(401).send("Data Not Update");
                }
            });
    } catch (error) {
        console.log(error);
    }
});

















// router.get('/', async (req, res) => {
//     try {
//         await Product.find({}, (err, data) => {
//             if (!err) {
//                 res.status(200).json(data);
//             }
//             else {
//                 res.send("there was server side error");
//             }
//         });
//     } catch (error) {

//     }
// });
// router.get('/:id', async (req, res) => {
//     try {
//         await Product.findById({ _id: req.params.id }, (err, data) => {
//             if (!err) {
//                 res.status(200).json(data);
//             }
//             else {
//                 res.send('there was server side error');
//             }
//         })
//     } catch (error) {

//     }
// });
// router.post('/add_product', upload.single('img'), async (req, res) => {
//     console.log(req.file);
//     try {
//         await Seller({
//             userName: req.body.userName,
//             email: req.body.category,
//             shop: req.file.filename,
//             img: req.body.price,
//             password: req.body.qty,

//         }).save((err) => {
//             if (err) {
//                 console.log(err);
//                 res.status(200).send('Data not inserted Successfully')
//             }
//             else {
//                 res.status(200).send('Data inserted Successfully');
//             }
//         })
//     } catch (error) {
//         res.send("muri kha");
//     }
// });
// router.post('/all', async (req, res) => {
//     try {
//         await Product.insertMany(req.body, (err) => {
//             if (err) {
//                 const error = mongooseErrorHandler(err);
//                 console.log(error);
//             }
//             else {
//                 res.status(200).json({
//                     massage: 'Data inserted Successfully',
//                 })
//             }
//         })
//     } catch (error) {

//     }

// });
// router.put('/:status/:id', async (req, res) => {
//     try {
//         await Product.findByIdAndUpdate({ _id: req.params.id }, {
//             $set: {
//                 status: req.params.status
//             }
//         },
//             {
//                 new: true,
//                 useFindAndModify: false,
//             },
//             (err, doc) => {
//                 if (!err) {
//                     res.status(200).json(doc)
//                 }
//                 else {
//                     res.send("Data Not Update");
//                 }
//             });
//     }
//     catch (error) {
//         // res.json({
//         //     massage:"Please Slug unique"
//         // })
//     }
// });
// router.put('/:id', async (req, res) => {
//     console.log(req.body.form);
//     try {
//         await Product.findByIdAndUpdate({ _id: req.params.id }, {
//             $set: {
//                 title: req.body.form.title,
//                 category: req.body.form.category,
//                 // img: req.body.form.img,
//                 price: req.body.form.price,
//                 qty: req.body.form.qty,
//                 des: req.body.form.des,
//                 shop: req.body.form.shop
//             }
//         },
//             {
//                 new: true,
//                 useFindAndModify: false,
//             },
//             (err) => {
//                 if (!err) {
//                     res.status(200).send("Product Updated Successfully");
//                 }
//                 else {
//                     res.send("Product Not Updated Successfully");
//                 }
//             });
//     }
//     catch (error) {
//         // res.json({
//         //     massage:"Please Slug unique"
//         // })
//     }

// });
// router.delete('/:id', async (req, res) => {
//     try {
//         fs.unlink(`../react/my-app/public/upload/${req.body.img}`, (err) => {
//             if (err) {
//                 throw new Error(err);
//             }
//         });
//         await Product.deleteOne({ _id: req.params.id }, (err) => {
//             if (err) {
//                 console.log(err);
//             }
//             else {
//                 res.status(200).send("Successfuly Delete");
//             }
//         });

//     } catch (error) {

//     }
// });


module.exports = router;