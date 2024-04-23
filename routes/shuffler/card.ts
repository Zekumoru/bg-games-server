import express from 'express';
import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import ShufflerCard, { IShufflerCard } from '../../models/ShufflerCard';

const cardRouter = express.Router();

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
  .escape()
  .custom(async (name) => {
    const card = await ShufflerCard.findOne({ name });
    if (card) throw new Error(`Card '${name}' already exists`);
  });

cardRouter.post(
  '/create',
  nameValidations,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({
        status: 422,
        message: 'Card fields have errors.',
        errors: errors.mapped(),
      });
      return;
    }

    const card = new ShufflerCard({ name: req.body.name });
    await card.save();

    res.status(201).json({
      status: 201,
      message: `Card '${card.name}' has been created successfully!`,
      card: extractCard(card),
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
