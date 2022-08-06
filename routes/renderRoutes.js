const express = require('express');
const renderController = require('../controller/renderController.js');

const router = express.Router();

router.route('/').get(renderController.renderHomepage);

router.route('/game').get(renderController.renderGame);

router.route('/register').get(renderController.renderRegister);

router.route('/user-dashboard').get(renderController.renderUserDashboard);

router.route('/biodata-dashboard').get(renderController.renderBiodataDashboard);

router.route('/history-dashboard').get(renderController.renderHistoryDashboard);

module.exports = router;
