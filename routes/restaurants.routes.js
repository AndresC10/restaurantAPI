const { Router } = require('express');
const { check } = require('express-validator');
const {
  findRestaurants,
  findRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  createReview,
  updateReview,
  removeReview,
} = require('../controllers/restaurants.controllers');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const {
  validIfExistRestaurant,
} = require('../middleware/restaurants.middleware');
const { validateFields } = require('../middleware/validateField.middleware');

const router = Router();

router.get('/', findRestaurants);

router.get('/:id', findRestaurant);

router.use(protect);

router.post(
  '/',
  [
    check('name', 'The name must be provided').not().isEmpty(),
    check('address', 'The address must be provided').not().isEmpty(),
    check('rating', 'The raiting must be provided').not().isEmpty(),
    check('rating', 'The raiting must be a integer').isInt(),
    validateFields,
    restrictTo('admin'),
  ],
  createRestaurant
);

router.put(
  '/:id',
  restrictTo('admin'),
  validIfExistRestaurant,
  updateRestaurant
);

router.patch(
  '/:id',
  restrictTo('admin'),
  validIfExistRestaurant,
  updateRestaurant
);

router.delete(
  '/:id',
  restrictTo('admin'),
  validIfExistRestaurant,
  deleteRestaurant
);

router.post('/reviews/:id', createReview);

router.patch('reviews/:restaurantId/:id', updateReview);

router.put('reviews/:restaurantId/:id', updateReview);

router.delete('reviews/:restaurantId/:id', removeReview);

module.exports = {
  restaurantRouter: router,
};
