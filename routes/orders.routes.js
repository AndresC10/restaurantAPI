const { Router } = require('express');
const {
  createOrder,
  deleteOrder,
  updateOrder,
} = require('../controllers/orders.controllers');
const { getOrder } = require('../controllers/users.controllers');
const { protect } = require('../middleware/auth.middleware');

const router = Router();

router.use(protect);

router.post('/', createOrder);

router.get('/me', getOrder);

router.patch('/:id', updateOrder);

router.put('/:id', updateOrder);

router.delete('/:id', deleteOrder);

module.exports = {
  ordersRouter: router,
};
