import express from 'express';

const cardRouter = express.Router();

cardRouter.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'Shuffler card route hit!',
  });
});

export default cardRouter;
