const History = require('../model/historyModel');

exports.getHistories = async (req, res) => {
    try {
        const histories = await History.find();

        res.status(200).json({
            status: 'success',
            data: {
                histories,
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

exports.getHistory = async (req, res) => {
    try {
        const history = await History.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                history,
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

exports.updateHistory = async (req, res) => {
    try {
        const history = await History.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: 'success',
            data: {
                history,
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
