import { connectMongoDB } from './db/connectMongoDB.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import {errorHandler} from './middleware/errorHandler.js';
import 'dotenv/config';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { logger } from './middleware/logger.js';
import notesRoutes from './routes/notesRoutes.js';
import { errors } from 'celebrate';


const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(logger);
app.use(express.json());

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(cookieParser());

app.use(authRoutes);
app.use(userRoutes);
app.use(notesRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
