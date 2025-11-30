import { Router } from 'express';
import * as itemController from '../modules/controllers/item.controller.js';
import { isAuthenticated} from '../../middlewares/auth.middleware.js';
import { validateParams, validateRequest } from '../../middlewares/validator.middleware.js';
import { itemParamsSchema, createItemSchema, updateItemSchema, itemQuerySchema } from '../modules/validators/item.validator.js';

export const itemRouter = Router();

itemRouter.post('/item', isAuthenticated, validateRequest(createItemSchema), itemController.createItem);
itemRouter.get('/items', isAuthenticated, itemController.getAllItems);
itemRouter.get('/items/order/:orderId', isAuthenticated, itemController.getItemsByOrderId);
itemRouter.get('/item/:id', isAuthenticated, validateParams(itemParamsSchema), itemController.getItemById);
itemRouter.put('/item/:id', isAuthenticated, validateParams(itemParamsSchema), validateRequest(updateItemSchema), itemController.updateItem);
itemRouter.delete('/item/:id', isAuthenticated, validateParams(itemParamsSchema), itemController.deleteItem);