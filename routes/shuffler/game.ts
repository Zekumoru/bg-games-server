import express from 'express';
import asyncHandler from 'express-async-handler';
import ShufflerGame, {
  IShufflerGame,
  IShufflerGameCard,
} from '../../models/ShufflerGame';
import ShufflerCard from '../../models/ShufflerCard';
import shuffle from '../../utils/shuffle';

const gameRouter = express.Router();

gameRouter.post(
  '/new',
  asyncHandler(async (req, res) => {
    // 1. get all cards to create game cards
    const cards = await ShufflerCard.find({});

    // 2. shuffle cards to their respective shuffled property
    const shuffledCards: IShufflerGameCard[] = cards.map(({ name }) => ({
      name,
      shuffled: shuffle(name.split('')).join(''),
      guessed: false,
      guessedAt: null,
    }));

    // 3. save these shuffled game cards
    const game = new ShufflerGame({ cards: shuffledCards });
    await game.save();

    res.json({
      status: 200,
      message: 'Game cards have been updated and reshuffled!',
      gameId: game._id,
    });
  })
);

gameRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json({
      status: 200,
      message: 'Shuffler game route hit!',
    });
  })
);

export default gameRouter;
