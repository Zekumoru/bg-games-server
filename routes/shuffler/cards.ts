import express from 'express';

const cardsRouter = express.Router();

cardsRouter.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'Shuffler cards route hit!',
  });
});

export default cardsRouter;
