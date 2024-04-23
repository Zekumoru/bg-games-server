import express from 'express';
import asyncHandler from 'express-async-handler';
import ShufflerCard, { IShufflerCard } from '../../models/ShufflerCard';
import handleValidationErrors from '../../middlewares/handleValidationErrors';
import extractCard from './card/utils/extractCard';
import nameValidations from './card/validations/nameValidations';
import handleCardNotExists from './card/middlewares/handleCardNotExists';

const cardRouter = express.Router();

cardRouter.post(
  '/create',
  nameValidations.custom(async (name) => {
    const card = await ShufflerCard.findOne({ name });
    if (card) throw new Error(`Card '${name}' already exists`);
  }),
  handleValidationErrors('Card fields have errors.'),
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

cardRouter.post(
  '/:name/update',
  handleCardNotExists,
  nameValidations.custom(async (name) => {
    const card = await ShufflerCard.findOne({ name });
    if (card) throw new Error(`Card '${name}' already exists`);
  }),
  handleValidationErrors('Card fields have errors.'),
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
