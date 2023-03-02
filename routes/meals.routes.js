const { Router } = require('express');
const { check } = require('express-validator');
const {
  findMeal,
  findMeals,
  createMeal,
  updateMeal,
  deleteMeal,
} = require('../controllers/meals.controllers');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { validateFields } = require('../middleware/validateField.middleware');

const router = Router();

router.get('/', findMeals);

router.get('/:id', findMeal);

router.use(protect);

router.post(
  '/:id',
  [
    check('name', 'The name must be provided').not().isEmpty(),
    check('price', 'The price must be provided').not().isEmpty(),
    check('price', 'The price must be a integer').isInt(),
    validateFields,
    restrictTo('admin'),
  ],
  createMeal
);

router.patch('/:id', restrictTo('admin'), updateMeal);

router.put('/:id', restrictTo('admin'), updateMeal);

router.delete('/:id', restrictTo('admin'), deleteMeal);

module.exports = {
  mealsRouter: router,
};
