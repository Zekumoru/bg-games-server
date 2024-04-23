import express from 'express';
import shufflerCardRouter from './shuffler/card';
import shufflerCardsRouter from './shuffler/cards';

const shufflerRouter = express.Router();

shufflerRouter.use('/card', shufflerCardRouter);
shufflerRouter.use('/cards', shufflerCardsRouter);

shufflerRouter.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'Shuffler route hit!',
  });
});

export default shufflerRouter;
