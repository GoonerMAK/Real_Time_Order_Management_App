import { z } from "zod";

const paymentTypeEnum = z.enum(["STRIPE", "PAYPAL"]);
const paymentStatusEnum = z.enum(["PENDING", "PAID", "FAILED"]);
const orderStatusEnum = z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"]);

export const orderParamsSchema = z.object({
    id: z.uuid({ message: "Invalid order ID format. Must be a UUID." })
});

export const createOrderSchema = z.object({
    total_amount: z.number().positive({ message: "Total amount must be a positive number" }),
    payment_type: paymentTypeEnum,
    payment_status: paymentStatusEnum.default("PENDING"),
    order_status: orderStatusEnum.default("PENDING"),
    created_by_id: z.uuid({ message: "Invalid user ID format" }),
    items: z.array(z.object({
        title: z.string().min(1, { message: "Item title is required" }),
        price: z.number().positive({ message: "Item price must be positive" }),
        quantity: z.number().int().positive({ message: "Quantity must be a positive integer" })
    })).min(1, { message: "Order must have at least one item" })
});

export const updateOrderSchema = z.object({
    id: z.uuid({ message: "Invalid order ID" }).optional(),
    data: z.object({
        total_amount: z.number().positive({ message: "Total amount must be positive" }).optional(),
        payment_type: paymentTypeEnum.optional(),
        payment_status: paymentStatusEnum.optional(),
        order_status: orderStatusEnum.optional(),
    })
});

export const orderQuerySchema = z.object({
    created_by_id: z.string().uuid().optional(),
    payment_status: paymentStatusEnum.optional(),
    order_status: orderStatusEnum.optional(),
    page: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
    limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).optional(),
});

export type OrderParams = z.infer<typeof orderParamsSchema>;
export type OrderCreate = z.infer<typeof createOrderSchema>;
export type OrderUpdate = z.infer<typeof updateOrderSchema>;
export type OrderQuery = z.infer<typeof orderQuerySchema>;