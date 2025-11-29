import express from "express";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";

export const app = express()
dotenv.config();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;
export const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
