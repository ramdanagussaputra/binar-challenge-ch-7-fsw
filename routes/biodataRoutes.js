const router = require('express').Router();
const biodataController = require('../controller/biodataController');

router.route('/').get(biodataController.getBiodatas);

router
    .route('/:id')
    .patch(biodataController.updateBiodata)
    .get(biodataController.getBiodata);

module.exports = router;
