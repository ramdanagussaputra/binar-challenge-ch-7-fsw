const axios = require('axios');
const User = require('../model/userModel');
const Biodata = require('../model/biodataModel');
const History = require('../model/historyModel');

exports.createUser = async (req, res) => {
    try {
        const biodataClient = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            born: req.body.born,
            gender: req.body.gender,
            address: req.body.address,
        };

        const biodata = await Biodata.create(biodataClient);

        const historyClient = {
            win: req.body.win,
            lose: req.body.lose,
            draw: req.body.draw,
            date: req.body.date,
        };

        const history = await History.create(historyClient);

        const userClient = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            biodataId: biodata._id,
            historyId: history._id,
            isAdmin: req.body.isAdmin || false,
        };

        const user = await User.create(userClient);

        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            status: 'bad request',
            message: 'Invalid data input',
        });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $lookup: {
                    from: 'biodatas',
                    localField: 'biodataId',
                    foreignField: '_id',
                    as: 'biodata',
                },
            },
            {
                $lookup: {
                    from: 'histories',
                    localField: 'historyId',
                    foreignField: '_id',
                    as: 'history',
                },
            },
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                users,
            },
        });
    } catch (err) {
        console.error(err);
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(404).json({
            status: 'fail',
            message: 'Data not found',
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(404).json({
            status: 'fail',
            message: 'Data not found',
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const response = await axios.get(
            `http://localhost:7000/api/user-game/${req.params.id}`
        );

        const { biodataId, historyId } = response.data.data.user;

        await History.findByIdAndDelete(historyId);
        await Biodata.findByIdAndDelete(biodataId);
        await User.findByIdAndDelete(req.params.id);

        await res.status(204).json({
            status: 'success',
        });
    } catch (err) {
        console.error(err);
        res.status(404).json({
            status: 'fail',
            message: 'Data not found',
        });
    }
};
