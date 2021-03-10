import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors'
import 'reflect-metadata'; // Aways in the Begin of the main file
import createConnection from "./database";
import { AppError } from './errors/AppError';
import router from './router';

createConnection();

const app = express();
app.use(express.json())
app.use(router);

app.use((err: Error, request: Request, response: Response, next: NextFunction)=>{
    if (err instanceof AppError)
        return response.status(err.statusCode).json({
            message: err.message
        })
    
    return response.status(500).json({
        status: "Error",
        message: `Internal server error ${err.message}`
    })
})

export default app