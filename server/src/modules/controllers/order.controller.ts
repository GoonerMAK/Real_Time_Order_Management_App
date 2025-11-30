import type { Request, Response } from 'express';
import * as orderService from '../services/order.service.js';
import type { OrderParams, OrderCreate, OrderUpdate, OrderQuery } from '../validators/order.validator.js';

export const createOrder = async (
    req: Request<unknown, unknown, OrderCreate, unknown>,
    res: Response
) => {
    const { created_by_id, total_amount, items, payment_type, payment_status, order_status } = req.body;
    
    try {
        const newOrder = await orderService.createOrder(
            created_by_id,
            total_amount,
            items,
            payment_type,
            payment_status,
            order_status
        );
        res.status(201).json(newOrder);
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Failed to create order' });
    }
};


export const updateOrder = async (
    req: Request<OrderParams, unknown, OrderUpdate, unknown>,
    res: Response
) => {
    const { id } = req.params;
    const { total_amount, payment_type, payment_status, order_status } = req.body.data;
    
    try {
        const updatedOrder = await orderService.updateOrder(id, {
            totalAmount: total_amount,
            paymentType: payment_type,
            paymentStatus: payment_status,
            orderStatus: order_status,
        });
        res.status(200).json(updatedOrder);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to update order' });
        }
    }
};

export const deleteOrder = async (
    req: Request<OrderParams, unknown, unknown, unknown>,
    res: Response
) => {
    const { id } = req.params;
    
    try {
        const deletedOrder = await orderService.deleteOrder(id);
        res.status(200).json({ message: 'Order deleted successfully', order: deletedOrder });
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to delete order' });
        }
    }
};

export const getAllOrders = async (
    req: Request<unknown, unknown, unknown, OrderQuery>,
    res: Response
) => {
    const { created_by_id, payment_status, order_status } = req.query;
    
    try {
        const filters: any = {};
        if (created_by_id) filters.created_by_id = created_by_id;
        if (payment_status) filters.payment_status = payment_status;
        if (order_status) filters.order_status = order_status;
        
        const orders = await orderService.getAllOrders(filters);
        res.status(200).json(orders);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to fetch orders' });
    }
};

export const getOrderById = async (
    req: Request<OrderParams, unknown, unknown, unknown>,
    res: Response
) => {
    const { id } = req.params;
    
    try {
        const order = await orderService.getOrderById(id);
        res.status(200).json(order);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message || 'Failed to fetch order' });
        }
    }
};

export const getOrdersByUserId = async (
    req: Request<{ userId: string }, unknown, unknown, unknown>,
    res: Response
) => {
    const { userId } = req.params;
    
    try {
        const orders = await orderService.getOrdersByUserId(userId);
        res.status(200).json(orders);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message || 'Failed to fetch orders' });
        }
    }
};


export const updatePaymentStatus = async (
    req: Request<OrderParams, unknown, { payment_status: "PENDING" | "PAID" | "FAILED" }, unknown>,
    res: Response
) => {
    const { id } = req.params;
    const { payment_status } = req.body;
    
    try {
        const updatedOrder = await orderService.updatePaymentStatus(id, payment_status);
        res.status(200).json(updatedOrder);
    } catch (error: any) {
        if (error.message.includes('not found')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(400).json({ message: error.message || 'Failed to update payment status' });
        }
    }
};