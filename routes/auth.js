const router = require("express").Router();
const User = require('../model/User');
const jwt = require("jsonwebtoken");
var jwtDecode = require('jwt-decode');
const storage = require("../storage/storage");
const uploadMiddle = require("../storage/uploadMiddleware");
const path = require('path');




router.post('/register', async (req, res) => {
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email Already exists');

    // const filename = await fileUpload.save(req.file.buffer)

    // create a new user 
    const user = new User({
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.name,
        email: req.body.email,
        password: req.body.password,
        profilePic: req.body.profilePic,
        dob: req.body.dob
    });

    try {
        const saveUser = await user.save();
        console.log(res.send(saveUser));

    } catch (error) {
        res.status(400).send(error);

    }
    // console.log("user", user)
});



// login 

router.post('/login', async (req, res) => {
    const data = await User.findOne({ email: req.body.email });
    if (!data) return res.status(400).send('User is Not register Please Check your Email');

    const password = await User.findOne({ password: req.body.password });
    if (!password) return res.status(400).send('password Not Match');

    const token = jwt.sign({ data }, "abcd");
    const response = {
        "token": token
    }
    res.header('auth-token', token)
        .send(response);


})



// get user profhomloile by token 
router.post('/userProfile', async (req, res) => {
    const token = req.body.token;
    if (token) {
        const decoded = jwtDecode(token);
        console.log(decoded)
        const data = await User.findOne({ email: decoded && decoded.data.email })
        res.send(data);
    }
    else {
        res.send("invalid token ")
    }
})


// get all user 
router.get('/getUserList', async (req, res, next) => {
    User.find((err, user) => {
        if (err) return next(err)
        res.json(user)
    })
})


// delete user by id 
router.post('/delete', async (req, res, next) => {
    const query = req.body._id;
    console.log("REQ PARMS" , query)
    // const id = req.body.id;
    User.findByIdAndDelete(query, (err) => {
        if(err){
            console.log(err)
        }
        else{
            res.send("Sucess")
        }
    })
})


module.exports = router;