const History = require('../model/historyModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

exports.createHistory = catchAsync(async (req, res, next) => {
    req.body.user = req.params.userId;

    const history = await History.create(req.body);
    if (!history) throw new AppError('Invalid history input', 400);

    response.sendRes(res, history);
});

exports.getHistories = catchAsync(async (req, res, next) => {
    const filterUser = req.params.userId ? { user: req.params.userId } : {};
    const histories = await History.find(filterUser);

    response.sendResResult(res, histories);
});

exports.getHistory = catchAsync(async (req, res, next) => {
    const history = await History.find(req.params.id);
    if (!history) throw new AppError('history not found', 404);

    response.sendRes(res, history);
});

exports.updateHistory = catchAsync(async (req, res, next) => {
    const history = await History.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!history) throw new AppError('history not found', 404);

    response.sendRes(res, history);
});

// exports.getHistories = async (req, res) => {
//     try {
//         const histories = await History.find();

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 histories,
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

// exports.getHistory = async (req, res) => {
//     try {
//         const history = await History.findById(req.params.id);

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 history,
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

// exports.updateHistory = async (req, res) => {
//     try {
//         const history = await History.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//             runValidators: true,
//         });

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 history,
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
