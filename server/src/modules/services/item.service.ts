import prisma from "../../../utils/prisma.js";


export const createItem = async (
    orderId: string,
    title: string,
    price: number,
    quantity: number,
) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
    });

    if (!order) throw new Error(`Order with id ${orderId} not found`);

    return await prisma.item.create({
        data: {
            order_id: orderId,
            title,
            price,
            quantity,
        },
    });
};


export const updateItem = async (
    itemId: string,
    updates: {
        title?: string;
        price?: number;
        quantity?: number;
    }
) => {
    const existing = await prisma.item.findUnique({
        where: { id: itemId },
    });

    if (!existing) throw new Error(`Item with id ${itemId} not found`);

    return await prisma.item.update({
        where: { id: itemId },
        data: updates,
        include: { order: true },
    });
};


export const getItemById = async (itemId: string) => {
    const item = await prisma.item.findUnique({
        where: { id: itemId },
        include: { order: true },
    });

    if (!item) throw new Error(`Item with id ${itemId} not found`);
    
    return item;
};


export const getAllItems = async () => {
    return await prisma.item.findMany({
        include: { order: true },
    });
};


export const deleteItem = async (itemId: string) => {
    return await prisma.item.delete({
        where: { id: itemId },
    });
};


export const getItemsByOrderId = async (orderId: string) => {
    return await prisma.item.findMany({
        where: { order_id: orderId },
    });
};
