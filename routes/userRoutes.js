const router = require('express').Router();
const userController = require('../controller/userController');
const historyRouter = require('../routes/historyRoutes');

router.use('/:userId/history', historyRouter);

router.route('/').get(userController.getUsers).post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
