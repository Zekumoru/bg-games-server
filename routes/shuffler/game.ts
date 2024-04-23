import express, { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import ShufflerGame, {
  IShufflerGame,
  IShufflerGameCard,
} from '../../models/ShufflerGame';
import ShufflerCard from '../../models/ShufflerCard';
import shuffle from '../../utils/shuffle';
import {
  Document,
  FilterQuery,
  MongooseError,
  isValidObjectId,
} from 'mongoose';

const gameRouter = express.Router();

export type TShufflerGameFind =
  | (Document<IShufflerGame> & FilterQuery<IShufflerGame>)
  | null;

declare global {
  namespace Express {
    interface Request {
      game: TShufflerGameFind;
    }
  }
}

const handleGameNotExists = asyncHandler(async (req, res, next) => {
  req.game = (await ShufflerGame.findById(req.params.id)) as TShufflerGameFind;
  if (!req.game) {
    res.status(404).json({
      status: 404,
      message: `Game with id '${req.params.id}' does not exist`,
    });
    return;
  }

  next();
});

const extractGame = ({ _id, cards, createdAt }: IShufflerGame) => ({
  id: _id,
  cards: cards.map(({ name, shuffled, guessed, guessedAt }) => ({
    name,
    shuffled,
    guessed,
    guessedAt,
  })),
  createdAt,
});

const handleValidId = (req: Request, res: Response, next: NextFunction) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(422).json({
      status: 422,
      message: `Invalid id '${req.params.id}'`,
    });
    return;
  }

  next();
};

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
