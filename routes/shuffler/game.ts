import express from 'express';
import asyncHandler from 'express-async-handler';
import ShufflerGame, {
  IShufflerGame,
  IShufflerGameCard,
} from '../../models/ShufflerGame';
import ShufflerCard from '../../models/ShufflerCard';
import shuffle from '../../utils/shuffle';
import { MongooseError } from 'mongoose';
import handleValidId from './game/middlewares/handleValidId';
import extractGame from './game/utils/extractGame';
import handleGameNotExists from './game/middlewares/handleGameNotExists';

const gameRouter = express.Router();

gameRouter.post(
  '/new',
  asyncHandler(async (req, res) => {
    // 1. get all cards to create game cards
    const cards = await ShufflerCard.find({});

    // 2. shuffle cards to their respective shuffled property
    const shuffledCards: IShufflerGameCard[] = shuffle(
      cards.map(({ name }) => ({
        name,
        shuffled: shuffle(name.split('')).join(''),
        guessed: false,
        guessedAt: null,
      }))
    );

    // 3. save these shuffled game cards
    const game = new ShufflerGame({ cards: shuffledCards });
    await game.save();

    res.status(201).json({
      status: 201,
      message: 'Game cards have been updated and reshuffled!',
      gameId: game._id,
    });
  })
);

gameRouter.post(
  '/:id/update',
  handleValidId,
  handleGameNotExists,
  asyncHandler(async (req, res) => {
    const data = req.body as IShufflerGame;

    try {
      req.game?.overwrite(data);
      await req.game?.save();
    } catch (error) {
      if (error instanceof MongooseError) {
        res.status(422).json({
          status: 422,
          message: error.message,
        });
      } else {
        throw error;
      }
      return;
    }

    res.json({
      status: 200,
      message: `Game with id '${req.params.id}' has been successfully updated!`,
    });
  })
);

gameRouter.get(
  '/:id',
  handleValidId,
  handleGameNotExists,
  asyncHandler(async (req, res) => {
    res.json({
      status: 200,
      message: '',
      game: extractGame(req.game as IShufflerGame),
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
