const router = require('express').Router();
const userController = require('../controller/userController');

router.route('/').get(userController.getUsers).post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
