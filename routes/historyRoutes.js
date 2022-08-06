const router = require('express').Router();
const historyController = require('../controller/historyController');

router.route('/').get(historyController.getHistories);

router
    .route('/:id')
    .patch(historyController.updateHistory)
    .get(historyController.getHistory);

module.exports = router;
