const router = require('express').Router();
const biodataController = require('../controller/biodataController');

// prettier-ignore
router
    .route('/')
    .get(biodataController.getBiodatas);

// prettier-ignore
router
    .route('/:id')
    .patch(biodataController.updateBiodata)
    .get(biodataController.getBiodata);

module.exports = router;
