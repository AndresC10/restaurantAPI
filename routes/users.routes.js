const { Router } = require('express');
const { check } = require('express-validator');
const {
  getOrders,
  getOrder,
  createUser,
  updateUser,
  deleteUser,
  login,
} = require('../controllers/users.controllers');
const {
  protect,
  protectAccountOwner,
} = require('../middleware/auth.middleware');
const { validIfExistUser } = require('../middleware/users.middleware');
const { validateFields } = require('../middleware/validateField.middleware');

const router = Router();

router.post(
  '/signup',
  [
    check('name', 'The name must be provided').not().isEmpty(),
    check('email', 'The email must be provided').not().isEmpty(),
    check('email', 'The email must be in the correct format').isEmail(),
    check('password', 'The password must be provided').not().isEmpty(),
    validateFields,
  ],
  createUser
);

router.post(
  '/login',
  [
    check('email', 'The email must be provided').not().isEmpty(),
    check('email', 'The email must be in the correct format').isEmail(),
    check('password', 'The password must be provided').not().isEmpty(),
    validateFields,
  ],
  login
);

router.use(protect);

router.patch('/:id', validIfExistUser, protectAccountOwner, updateUser);

router.put('/:id', validIfExistUser, protectAccountOwner, updateUser);

router.delete('/:id', validIfExistUser, protectAccountOwner, deleteUser);

router.get('/orders', getOrders);

router.get('/orders/:id', getOrder);

module.exports = {
  usersRouter: router,
};
