const axios = require('axios');
const User = require('../model/userModel');
const Biodata = require('../model/biodataModel');
const History = require('../model/historyModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const response = require('../utils/response');

exports.createUser = catchAsync(async (req, res, next) => {
    const biodataClient = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        born: req.body.born,
        gender: req.body.gender,
        address: req.body.address,
    };

    const biodata = await Biodata.create(biodataClient);
    if (!biodata) throw new AppError('Invalid biodata input', 400);

    console.log(biodata._id);

    const userClient = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        biodata: biodata._id,
    };

    const user = await User.create(userClient);
    if (!user) throw new AppError('Invalid user input', 400);

    const fulluser = await User.findById(user._id).populate('biodata');
    console.log(fulluser);
    console.log(user._id);
    response.sendRes(res, fulluser);
});

exports.getUsers = catchAsync(async (req, res, next) => {
    const Users = await User.find().populate('history biodata');

    response.sendResResult(res, Users);
});

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).populate('history biodata');
    if (!user) throw new AppError('User not found', 404);

    response.sendRes(res, user);
});

exports.updateUser = catchAsync(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    response.sendRes(res, user);
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const response = await axios.get(
        `http://localhost:7000/api/user-game/${req.params.id}`
    );

    // prettier-ignore
    const {biodata: { _id: biodataId }} = response.data.data.data;

    await History.deleteMany({ user: req.params.id });
    await Biodata.findByIdAndDelete(biodataId);
    await User.findByIdAndDelete(req.params.id);

    await res.status(204).json({
        status: 'success',
    });
});

// exports.createUser = async (req, res) => {
//     try {
//         const biodataClient = {
//             firstName: req.body.firstName,
//             lastName: req.body.lastName,
//             age: req.body.age,
//             born: req.body.born,
//             gender: req.body.gender,
//             address: req.body.address,
//         };

//         const biodata = await Biodata.create(biodataClient);

//         const historyClient = {
//             win: req.body.win,
//             lose: req.body.lose,
//             draw: req.body.draw,
//             date: req.body.date,
//         };

//         const history = await History.create(historyClient);

//         const userClient = {
//             email: req.body.email,
//             username: req.body.username,
//             password: req.body.password,
//             biodataId: biodata._id,
//             historyId: history._id,
//             isAdmin: req.body.isAdmin || false,
//         };

//         const user = await User.create(userClient);

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 user,
//             },
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(400).json({
//             status: 'bad request',
//             message: 'Invalid data input',
//         });
//     }
// };

// exports.getUsers = async (req, res) => {
//     try {
//         const users = await User.aggregate([
//             {
//                 $lookup: {
//                     from: 'biodatas',
//                     localField: 'biodataId',
//                     foreignField: '_id',
//                     as: 'biodata',
//                 },
//             },
//             {
//                 $lookup: {
//                     from: 'histories',
//                     localField: 'historyId',
//                     foreignField: '_id',
//                     as: 'history',
//                 },
//             },
//         ]);

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 users,
//             },
//         });
//     } catch (err) {
//         console.error(err);
//     }
// };

// exports.getUser = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 user,
//             },
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(404).json({
//             status: 'fail',
//             message: 'Data not found',
//         });
//     }
// };

// exports.updateUser = async (req, res) => {
//     try {
//         const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//             runValidators: true,
//         });

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 user,
//             },
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(404).json({
//             status: 'fail',
//             message: 'Data not found',
//         });
//     }
// };

// exports.deleteUser = async (req, res) => {
//     try {
//         const response = await axios.get(
//             `http://localhost:7000/api/user-game/${req.params.id}`
//         );

//         const { biodataId, historyId } = response.data.data.user;

//         await History.findByIdAndDelete(historyId);
//         await Biodata.findByIdAndDelete(biodataId);
//         await User.findByIdAndDelete(req.params.id);

//         await res.status(204).json({
//             status: 'success',
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(404).json({
//             status: 'fail',
//             message: 'Data not found',
//         });
//     }
// };
