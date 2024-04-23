import express, { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import ShufflerCard, { IShufflerCard } from '../../models/ShufflerCard';
import { Document, FilterQuery, Model } from 'mongoose';

const cardRouter = express.Router();

const handleValidationError = (errMessage: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({
        status: 422,
        message: errMessage,
        errors: errors.mapped(),
      });
      return;
    }

    next();
  };
};

const extractCard = ({ name, createdAt }: IShufflerCard) => ({
  name,
  createdAt,
});

const nameValidations = body('name')
  .trim()
  .toLowerCase()
  .notEmpty()
  .withMessage(`name is required`)
  .isLength({ max: 3000 })
  .withMessage(`name cannot have more than 3000 characters`)
  .escape();

cardRouter.post(
  '/create',
  nameValidations.custom(async (name) => {
    const card = await ShufflerCard.findOne({ name });
    if (card) throw new Error(`Card '${name}' already exists`);
  }),
  handleValidationError('Card fields have errors.'),
  asyncHandler(async (req, res) => {
    const card = new ShufflerCard({ name: req.body.name });
    await card.save();

    res.status(201).json({
      status: 201,
      message: `Card '${card.name}' has been created successfully!`,
      card: extractCard(card),
    });
  })
);

// declare global type for express request 'card' property
type TShufflerCardFind = Document<IShufflerCard> & FilterQuery<IShufflerCard>;
declare global {
  namespace Express {
    interface Request {
      card: TShufflerCardFind;
    }
  }
}

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

cardRouter.post(
  '/:name/update',
  handleCardNotExists,
  nameValidations.custom(async (name) => {
    const card = await ShufflerCard.findOne({ name });
    if (card) throw new Error(`Card '${name}' already exists`);
  }),
  handleValidationError('Card fields have errors.'),
  asyncHandler(async (req, res) => {
    req.card.overwrite({ name: req.body.name });
    await req.card.save();

    res.json({
      status: 200,
      message: `Card '${req.params.name}' has been updated successfully to '${req.body.name}'!`,
    });
  })
);

cardRouter.delete(
  '/:name/delete',
  handleCardNotExists,
  asyncHandler(async (req, res) => {
    await req.card.deleteOne();

    res.json({
      status: 200,
      message: `Card '${req.params.name}' has been successfully deleted`,
    });
  })
);

cardRouter.get(
  '/:name',
  asyncHandler(async (req, res) => {
    const card = await ShufflerCard.findOne<IShufflerCard>({
      name: req.params.name,
    });

    if (!card) {
      res.status(404).json({
        status: 404,
        message: `Card '${req.params.name}' does not exist`,
      });
      return;
    }

    res.json({
      status: 200,
      message: '',
      card: extractCard(card),
    });
  })
);

cardRouter.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'Shuffler card route hit!',
  });
});

export default cardRouter;
