const express = require('express');
const cors = require('cors');
const { db } = require('../database/db');
const AppError = require('../utils/appError');
const globalErrorHandler = require('../controllers/error.controllers');
const initModel = require('./init.model');
const { usersRouter } = require('../routes/users.routes');
const { restaurantRouter } = require('../routes/restaurants.routes');
const { mealsRouter } = require('../routes/meals.routes');
const { ordersRouter } = require('../routes/orders.routes');
const morgan = require('morgan');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      users: '/api/v1/users',
      restaurants: '/api/v1/restaurants',
      meals: '/api/v1/meals',
      orders: '/api/v1/orders',
    };

    this.database();

    this.middlewares();

    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.paths.users, usersRouter);
    this.app.use(this.paths.restaurants, restaurantRouter);
    this.app.use(this.paths.meals, mealsRouter);
    this.app.use(this.paths.orders, ordersRouter);
    this.app.all('*', (req, res, next) => {
      return next(
        new AppError(`Can't find ${req.originalUrl} on this server`, 404)
      );
    });
    this.app.use(globalErrorHandler);
  }

  database() {
    db.authenticate()
      .then(() => console.log('Database authenticated'))
      .catch(err => console.log(err));

    initModel();

    db.sync()
      .then(() => console.log('Database synced'))
      .catch(err => console.log(err));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Server Running on Port', this.port);
    });
  }
}

module.exports = Server;
