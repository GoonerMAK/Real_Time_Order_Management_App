import prisma from "../../../utils/prisma.js";
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;


export const createUser = async (
    username: string,
    password: string,
    email: string,
    name?: string,
    age?: number,
    gender?: string,
    nationality?: string
) => {
    const existingUsername = await prisma.user.findUnique({
        where: { username },
    });
    
    if (existingUsername) throw new Error("Username already exists");
    
    const existingEmail = await prisma.user.findUnique({
        where: { email },
    });
    
    if (existingEmail) { throw new Error('Email already exists'); }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    return await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
            email,
            name,
            age,
            gender,
            nationality,
        },
    });
};


export const updateUser = async (
    id: string,
    updates: {
        username?: string,
        password?: string,
        email?: string,
        name?: string,
        age?: number,
        gender?: string,
        nationality?: string
    }
) => {
    const data: any = { ...updates };
    
    const existingUser = await prisma.user.findUnique({
        where: { id },
    });

    if (!existingUser) {
        throw new Error(`User with id ${id} not found`);
    }

    // Checking if the new username is already in use by another user
    if (updates.username && updates.username !== existingUser.username) {
        const userWithUsername = await prisma.user.findUnique({
            where: { username: updates.username },
        });

        if (userWithUsername) {
            throw new Error('Username already exists');
        }
    }

    // Checking if the new email is already in use by another user
    if (updates.email && updates.email !== existingUser.email) {
        const userWithEmail = await prisma.user.findUnique({
            where: { email: updates.email },
        });

        if (userWithEmail) {
            throw new Error('Email already exists');
        }
    }

    if (updates.password) {
        data.password = await bcrypt.hash(updates.password, SALT_ROUNDS);
    }

    return await prisma.user.update({
        where: { id },
        data,
    });
};


export const deleteUser = async (id: string) => {
    return await prisma.user.delete({
        where: { id },
    });
};


export const getAllUsers = async () => {
    return await prisma.user.findMany();
};


export const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        throw new Error(`User with id ${id} not found`);
    }
    
    return user;
};


export const getUserByUsername = async (username: string) => {
    return await prisma.user.findUnique({ 
        where: { username },
    });
};


export const getUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email },
    });
}

export const getAllUsernames = async () => {
    const usernames = await prisma.user.findMany({
        select: {
            id: true,
            username: true, 
        },
    });
    return usernames;
};
