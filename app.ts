import express from 'express';
import errorHandler from './middlewares/errorHandler';
import createError from 'http-errors';
import cors from 'cors';
import indexRouter from './routes';
import shufflerRouter from './routes/shuffler';

const app = express();

app.use(
  cors({
    origin: ['http://127.0.0.1:5713', 'http://localhost:5173'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// set routers
app.use('/', indexRouter);
app.use('/shuffler', shufflerRouter);
app.use((req, res, next) => next(createError(500)));
app.use(errorHandler);

export default app;
