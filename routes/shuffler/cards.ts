import express from 'express';
import asyncHandler from 'express-async-handler';
import ShufflerCard from '../../models/ShufflerCard';
import extractCard from './card/utils/extractCard';

const cardsRouter = express.Router();

cardsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const cards = await ShufflerCard.find({});

    res.json({
      status: 200,
      message: '',
      cards: cards.map((card) => extractCard(card)),
    });
  })
);

export default cardsRouter;
