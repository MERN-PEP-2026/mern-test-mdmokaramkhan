import express from 'express';
import connectDB from './config/db.js';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).send({
        success: true,
        message: 'Welcome to the Task Management API',
    });
});

export default app;
