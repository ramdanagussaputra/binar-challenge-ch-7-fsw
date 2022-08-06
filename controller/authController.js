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

    data.password = undefined;

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

exports.login = catchAsync(async (req, res, next) => {
    // Check if password and username exist
    if (!req.body.username || !req.body.password)
        throw new AppError('Input your username and password');

    // Find user with username
    const user = await User.findOne({ username: req.body.username }).select('+password');

    // Check if password and username correct
    if (!user || !(await user.checkPassword(req.body.password, user.password)))
        throw new AppError('Wrong username or password', 404);

    console.log(user, user._id);
    createSendJWT(res, user);
});

exports.protect = catchAsync(async (req, res, next) => {
    // Check if token exist
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer'))
        throw new AppError('Token does not exist. Please login first!', 404);

    // Verify token
    const token = req.headers.authorization.split(' ');
    const decoded = verifyJWT(token[1], process.env.JWT_SECRET);

    // Check if user still exist
    const user = await User.findById(decoded.id);
    if (!user)
        throw new AppError('User belong to the token not exist. Please login again', 401);

    // Check if user password have changed
    if (user.passwordChanged(decoded.iat))
        throw new AppError('Password has change. please login again', 401);

    req.user = user;
    next();
});

exports.restrictTo =
    (...allowed) =>
    (req, res, next) => {
        if (!allowed.includes(req.user.role))
            throw new AppError('You have no access to this route', 403);

        next();
    };

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
