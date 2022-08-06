const axios = require('axios');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const response = require('../utils/response');
const Biodata = require('../model/biodataModel');
const User = require('../model/userModel');

const signJWT = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    });

const verifyJWT = (token) => jwt.verify(token, process.env.JWT_SECRET);

const createSendJWT = (res, data) => {
    const token = signJWT(data._id);

    res.status(200).json({
        status: 'success',
        token,
        data: {
            data,
        },
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const biodataClient = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        born: req.body.born,
        gender: req.body.gender,
        address: req.body.address,
    };

    const biodata = await Biodata.create(biodataClient);
    if (!biodata) throw new AppError('Invalid signup input', 400);

    console.log(biodata._id);

    const userClient = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        biodata: biodata._id,
    };

    const user = await User.create(userClient);
    if (!user) throw new AppError('Invalid signup input', 400);

    const fulluser = await User.findById(user._id).populate('biodata');

    response.sendRes(res, fulluser);
});

// exports.login = catchAsync(async (req, res, next) => {
//     // Check if password and username exist

//     // Check if password and username correct

//     // Check if user still exist
// })

// exports.loginUser = async (req, res) => {
//     // USER LOGIN INPUT
//     const { username, password, ok } = req.body;

//     // GET USER DATA FROM DATABASE
//     const response = await axios.get('http://localhost:7000/api/user-game');

//     const { data } = response.data.data;

//     // CHECK USERNAME AND PASSWORD
//     let usernameCorrect = false;
//     let passwordCorrect = false;
//     let userData;

//     data.forEach((user) => {
//         if (!(user.password === password && user.username === username)) return;

//         usernameCorrect = true;
//         passwordCorrect = true;
//         userData = user;
//     });

//     if (!usernameCorrect)
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Wrong username',
//         });
//     if (!passwordCorrect)
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Wrong password',
//         });

//     res.status(200).json({
//         status: 'success',
//         message: 'successful to login',
//         data: {
//             userData,
//         },
//     });

//     console.log(`Success, username: ${username}, password: ${password}`, userData);
// };
