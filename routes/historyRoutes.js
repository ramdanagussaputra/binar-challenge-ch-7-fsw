const router = require('express').Router({ mergeParams: true });
const historyController = require('../controller/historyController');

router
    .route('/')
    .get(historyController.getHistories)
    .post(historyController.createHistory);

router
    .route('/:id')
    .patch(historyController.updateHistory)
    .get(historyController.getHistory);

module.exports = router;
