const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Meal = require('../models/meals.model');
const Restaurant = require('../models/restaurants.model');

exports.createMeal = catchAsync(async (req, res) => {
  const { name, price } = req.body;
  const { id } = req.params;

  const meal = await Meal.create({
    name,
    price,
    restaurantId: id,
  });

  res.status(201).json({
    status: 'success',
    message: 'Meal created successfully',
    meal,
  });
});

exports.findMeals = catchAsync(async (req, res) => {
  const meals = await Meal.findAll({
    where: {
      status: true,
    },
    include: [
      {
        model: Restaurant,
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    message: 'The meals was found successfully',
    meals,
  });
});

exports.findMeal = catchAsync(async (req, res) => {
  const { id } = req.params;

  const meal = await Meal.findOne({
    where: {
      id,
      status: true,
    },
    include: [
      {
        model: Restaurant,
      },
    ],
  });

  if (!meal) {
    return next(new AppError('the meal was not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Meal was found successfully',
    meal,
  });
});

exports.updateMeal = catchAsync(async (req, res) => {
  const { name, price } = req.body;
  const { id } = req.params;

  const meal = await Meal.findOne({
    where: {
      id,
      status: true,
    },
  });

  if (!meal) {
    return next(new AppError('the meal was not found', 404));
  }

  await meal.update({ name, price });

  res.status(200).json({
    status: 'success',
    message: 'Meal updated successfully',
  });
});

exports.deleteMeal = catchAsync(async (req, res) => {
  const { id } = req.params;

  const meal = await Meal.findOne({
    where: {
      id,
      status: true,
    },
  });

  if (!meal) {
    return next(new AppError('the meal was not found', 404));
  }

  await meal.update({ status: false });

  res.status(200).json({
    status: 'success',
    message: 'Meal deleted successfully',
  });
});
