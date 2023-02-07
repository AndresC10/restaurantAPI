const User = require('../models/users.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const Restaurant = require('../models/restaurants.model');
const { findUserByToken } = require('../utils/findUserByToken');
const Review = require('../models/reviews.model');

exports.createRestaurant = catchAsync(async (req, res) => {
  const { name, address, rating } = req.body;

  const restaurant = await Restaurant.create({
    name: name.toLowerCase(),
    address: address.toLowerCase(),
    rating,
  });

  res.status(201).json({
    status: 'success',
    message: 'Restaurant created successfully',
    restaurant,
  });
});

exports.findRestaurants = catchAsync(async (req, res) => {
  const restaurants = await Restaurant.findAll({
    where: {
      status: true,
    },
  });

  res.status(200).json({
    status: 'success',
    message: 'Restaurants was found successfully',
    restaurants,
  });
});

exports.findRestaurant = catchAsync(async (req, res) => {
  const { restaurant } = req;

  res.status(200).json({
    status: 'success',
    message: 'Restaurant was found successfully',
    restaurant,
  });
});

exports.updateRestaurant = catchAsync(async (req, res) => {
  const { name, address } = req.body;
  const { restaurant } = req;

  await restaurant.update({ name, address });

  res.status(200).json({
    status: 'success',
    message: 'Restautant updated successfully',
  });
});

exports.deleteRestaurant = catchAsync(async (req, res) => {
  const { restaurant } = req;

  await restaurant.update({ status: false });

  res.status(200).json({
    status: 'success',
    message: 'Restaurant deleted successfully',
  });
});

exports.createReview = catchAsync(async (req, res) => {
  const { restaurant } = req;
  const { comment, rating } = req.body;

  const user = await findUserByToken();

  const review = await Review.create({
    userId: user.id,
    comment,
    restaurantId: restaurant.id,
    rating,
  });

  res.status(200).json({
    status: 'success',
    message: 'The review was created successfully',
    review,
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const token = req.headers.authorization.split(' ')[1];
  const { comment, rating } = req.body;

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  const user = await User.findOne({
    where: {
      id: decoded.id,
      status: true,
    },
  });

  const review = await Review.findOne({
    where: {
      id,
      status: true,
    },
  });

  if (user.id !== review.userId) {
    return next(new AppError("You can't modify this review", 401));
  }

  await review.update({ comment, rating });

  res.status(200).json({
    status: 'success',
    message: 'The review was updated successfully',
  });
});

exports.removeReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  const user = await User.findOne({
    where: {
      id: decoded.id,
      status: true,
    },
  });

  const review = await Review.findOne({
    where: {
      id,
      status: true,
    },
  });

  if (user.id !== review.userId) {
    return next(new AppError("You can't modify this review", 401));
  }

  await review.update({ status: false });

  res.status(200).json({
    status: 'success',
    message: 'The review was deleted successfully',
  });
});
