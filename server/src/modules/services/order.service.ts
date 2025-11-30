import prisma from "../../../utils/prisma.js";


export const createOrder = async (
    createdById: string,
    totalAmount: number,
    items: Array<{ title: string; price: number; quantity: number }>,
    paymentType: "STRIPE" | "PAYPAL",
    paymentStatus: "PENDING" | "PAID" | "FAILED" = "PENDING",
    orderStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" = "PENDING"
) => {
    const user = await prisma.user.findUnique({
        where: { id: createdById },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (!items || items.length === 0) {
        throw new Error("Order must contain at least 1 item.");
    }

    const order = await prisma.order.create({
        data: {
            created_by_id: createdById,
            total_amount: totalAmount,
            payment_type: paymentType,
            payment_status: paymentStatus,
            order_status: orderStatus,
            items: {
                create: items.map((item) => ({
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity,
                })),
            },
        },
        include: {
            items: true,
            created_by: true,
        },
    });

    return order;
};


export const updateOrder = async (
    orderId: string,
    updates: {
        totalAmount?: number;
        paymentType?: "STRIPE" | "PAYPAL";
        paymentStatus?: "PENDING" | "PAID" | "FAILED";
        orderStatus?: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
    }
) => {
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) throw new Error(`Order with id ${orderId} not found`);

    return await prisma.order.update({
        where: { id: orderId },
        data: {
            total_amount: updates.totalAmount,
            payment_type: updates.paymentType,
            payment_status: updates.paymentStatus,
            order_status: updates.orderStatus,
        },
        include: {
            items: true,
            created_by: true,
        },
    });
};


export const getOrderById = async (orderId: string) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: true,
            created_by: true,
        },
    });

    if (!order) throw new Error(`Order with id ${orderId} not found`);
    return order;
};


export const getAllOrders = async (
    filters?: {
        createdById?: string;
        paymentStatus?: "PENDING" | "PAID" | "FAILED";
        orderStatus?: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
    }
) => {
    return await prisma.order.findMany({
        where: {
            created_by_id: filters?.createdById,
            payment_status: filters?.paymentStatus,
            order_status: filters?.orderStatus,
        },
        include: {
            items: true,
            created_by: true,
        },
    });
};


export const deleteOrder = async (orderId: string) => {
    return await prisma.order.delete({ where: { id: orderId }, include: {items: true } });
};


export const getOrdersByUserId = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return await prisma.order.findMany({
        where: { created_by_id: userId },
        include: { items: true },
    });
};


export const updatePaymentStatus = async (
    orderId: string,
    paymentStatus: "PENDING" | "PAID" | "FAILED"
) => {
    return await prisma.order.update({
        where: { id: orderId },
        data: { payment_status: paymentStatus },
        include: {
            items: true,
        },
    });
};