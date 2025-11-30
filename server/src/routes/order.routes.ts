import { Router } from 'express';
import * as orderController from '../modules/controllers/order.controller.js';
import { isAuthenticated } from '../../middlewares/auth.middleware.js';
import { validateRequest, validateParams } from '../../middlewares/validator.middleware.js';
import { orderParamsSchema, createOrderSchema, updateOrderSchema } from '../modules/validators/order.validator.js';

export const orderRouter = Router();

orderRouter.post('/order', isAuthenticated, validateRequest(createOrderSchema), orderController.createOrder);
orderRouter.get('/orders', isAuthenticated, orderController.getAllOrders);
orderRouter.get('/orders/user/:userId', isAuthenticated, orderController.getOrdersByUserId);
orderRouter.get('/order/:id', isAuthenticated, validateParams(orderParamsSchema), orderController.getOrderById);
orderRouter.put('/order/:id', isAuthenticated, validateParams(orderParamsSchema), validateRequest(updateOrderSchema), orderController.updateOrder);
orderRouter.patch('/order/:id/payment', isAuthenticated, validateParams(orderParamsSchema), orderController.updatePaymentStatus);
orderRouter.delete('/order/:id', isAuthenticated, validateParams(orderParamsSchema), orderController.deleteOrder);