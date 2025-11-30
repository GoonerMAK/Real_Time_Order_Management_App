import express from "express";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";

import { userRouter } from "./routes/user.route.js";
import { authRouter } from "./routes/auth.routes.js";
import { orderRouter } from "./routes/order.routes.js";
import { itemRouter } from "./routes/item.routes.js";

export const app = express()
dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api', userRouter);
app.use('/api', orderRouter);
app.use('/api', itemRouter);

const PORT = process.env.PORT;
export const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
