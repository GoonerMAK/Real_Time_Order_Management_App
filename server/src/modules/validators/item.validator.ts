import { z } from "zod";

export const itemParamsSchema = z.object({
    id: z.uuid({ message: "Invalid item ID format. Must be a UUID." })
});

export const createItemSchema = z.object({
    title: z.string().min(1, { message: "Item title is required" }),
    price: z.number().positive({ message: "Item price must be a positive number" }),
    quantity: z.number().int().positive({ message: "Quantity must be a positive integer" }),
    order_id: z.uuid({ message: "Invalid order ID format" })
});

export const updateItemSchema = z.object({
    id: z.uuid({ message: "Invalid item ID" }).optional(),
    data: z.object({
        title: z.string().min(1, { message: "Item title is required" }).optional(),
        price: z.number().positive({ message: "Item price must be positive" }).optional(),
        quantity: z.number().int().positive({ message: "Quantity must be positive" }).optional(),
    })
});

export const itemQuerySchema = z.object({
    order_id: z.string().uuid().optional(),
    min_price: z.string().transform(Number).pipe(z.number().nonnegative()).optional(),
    max_price: z.string().transform(Number).pipe(z.number().positive()).optional(),
});

export type ItemParams = z.infer<typeof itemParamsSchema>;
export type ItemCreate = z.infer<typeof createItemSchema>;
export type ItemUpdate = z.infer<typeof updateItemSchema>;
export type ItemQuery = z.infer<typeof itemQuerySchema>;