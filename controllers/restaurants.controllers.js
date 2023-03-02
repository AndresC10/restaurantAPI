const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Restaurant = require('../models/restaurants.model');
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
    include: [
      {
        model: Review,
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    message: 'Restaurants was found successfully',
    restaurants,
  });
});

exports.findRestaurant = catchAsync(async (req, res) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findOne({
    where: {
      id,
      status: true,
    },
    include: [
      {
        model: Review,
      },
    ],
  });

  if (!restaurant) {
    return next(new AppError('the restaurant not found', 404));
  }

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
  const { id } = req.params;
  const { sessionUser } = req;
  const { comment, rating } = req.body;

  const review = await Review.create({
    userId: sessionUser.id,
    comment,
    restaurantId: id,
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
  const { sessionUser } = req;
  const { comment, rating } = req.body;

  const review = await Review.findOne({
    where: {
      id,
      status: true,
    },
  });

  if (sessionUser.id !== review.userId) {
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
  const { sessionUser } = req;

  const review = await Review.findOne({
    where: {
      id,
      status: true,
    },
  });

  if (sessionUser.id !== review.userId) {
    return next(new AppError("You can't modify this review", 401));
  }

  await review.update({ status: false });

  res.status(200).json({
    status: 'success',
    message: 'The review was deleted successfully',
  });
});
