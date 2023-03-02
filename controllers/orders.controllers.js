const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Order = require('../models/orders.model');
const Meal = require('../models/meals.model');

exports.createOrder = catchAsync(async (req, res, next) => {
  const { quantity, mealId } = req.body;
  const { sessionUser } = req;

  const meal = await Meal.findOne({
    where: {
      status: true,
      id: mealId,
    },
  });

  if (!meal) {
    return next(new AppError("The meal couldn't be found", 404));
  }

  const totalPrice = +meal.price * +quantity;

  const order = await Order.create({
    mealId,
    userId: sessionUser.id,
    totalPrice,
    quantity,
  });

  res.status(201).json({
    status: 'success',
    message: 'Order created successfully',
    order: {
      id: order.id,
      totalPrice,
      quantity,
    },
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { sessionUser } = req;

  const order = await Order.findOne({
    where: {
      status: 'active',
      id,
    },
  });

  if (!order) {
    return next(new AppError("The order was completed or doesn't exist"), 404);
  }

  if (order.id !== sessionUser.id) {
    return next(new AppError('This is not your order'));
  }

  await order.update({ status: 'completed' });

  res.status(200).json({
    status: 'succes',
    message: 'The order was completed',
    order,
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { sessionUser } = req;

  const order = await Order.findOne({
    where: {
      status: 'active',
      id,
    },
  });

  if (!order) {
    return next(new AppError("The order was completed or doesn't exist"), 404);
  }

  if (order.id !== sessionUser.id) {
    return next(new AppError('This is not your order', 401));
  }

  await order.update({ status: 'cancelled' });

  res.status(200).json({
    status: 'succes',
    message: 'The order was cancelled',
    order,
  });
});
