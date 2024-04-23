import asyncHandler from 'express-async-handler';
import ShufflerCard, { IShufflerCard } from '../../../../models/ShufflerCard';
import { TShufflerCardFind } from '../types/shufflerCardFind';

const handleCardNotExists = asyncHandler(async (req, res, next) => {
  req.card = (await ShufflerCard.findOne<IShufflerCard>({
    name: req.params.name,
  })) as TShufflerCardFind;

  if (!req.card) {
    res.status(422).json({
      status: 422,
      message: `Card '${req.params.name}' does not exist`,
    });
    return;
  }

  next();
});

export default handleCardNotExists;
