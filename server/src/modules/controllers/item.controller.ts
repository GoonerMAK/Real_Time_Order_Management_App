import type { Request, Response } from 'express';
import * as itemService from '../services/item.service.js';
import type { ItemParams, ItemCreate, ItemUpdate, ItemQuery } from '../validators/item.validator.js';

export const createItem = async (
    req: Request<unknown, unknown, ItemCreate, unknown>,
    res: Response
) => {
    const { order_id, title, price, quantity } = req.body;
    
    try {
        const newItem = await itemService.createItem(order_id, title, price, quantity);
        res.status(201).json(newItem);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to create item' });
        }
    }
};

export const updateItem = async (
    req: Request<ItemParams, unknown, ItemUpdate, unknown>,
    res: Response
) => {
    const { id } = req.params;
    const updates = req.body.data;
    
    try {
        const updatedItem = await itemService.updateItem(id, updates);
        res.status(200).json(updatedItem);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to update item' });
        }
    }
};

export const deleteItem = async (
    req: Request<ItemParams, unknown, unknown, unknown>,
    res: Response
) => {
    const { id } = req.params;
    
    try {
        const deletedItem = await itemService.deleteItem(id);
        res.status(200).json({ message: 'Item deleted successfully', item: deletedItem });
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to delete item' });
        }
    }
};

export const getAllItems = async (
    req: Request<unknown, unknown, unknown, ItemQuery>,
    res: Response
) => {
    try {
        const items = await itemService.getAllItems();
        res.status(200).json(items);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to fetch items' });
    }
};

export const getItemById = async (
    req: Request<ItemParams, unknown, unknown, unknown>,
    res: Response
) => {
    const { id } = req.params;
    
    try {
        const item = await itemService.getItemById(id);
        res.status(200).json(item);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message || 'Failed to fetch item' });
        }
    }
};

export const getItemsByOrderId = async (
    req: Request<{ orderId: string }, unknown, unknown, unknown>,
    res: Response
) => {
    const { orderId } = req.params;
    
    try {
        const items = await itemService.getItemsByOrderId(orderId);
        res.status(200).json(items);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message || 'Failed to fetch items' });
        }
    }
};
