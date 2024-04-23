import express from 'express';
import cardRouter from './shuffler/card';
import cardsRouter from './shuffler/cards';
import gameRouter from './shuffler/game';

const shufflerRouter = express.Router();

shufflerRouter.use('/card', cardRouter);
shufflerRouter.use('/cards', cardsRouter);
shufflerRouter.use('/game', gameRouter);

shufflerRouter.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'Shuffler route hit!',
  });
});

export default shufflerRouter;
