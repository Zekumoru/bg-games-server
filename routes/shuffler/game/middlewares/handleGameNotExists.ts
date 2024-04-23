import asyncHandler from 'express-async-handler';
import ShufflerGame from '../../../../models/ShufflerGame';
import { TShufflerGameFind } from '../types/shufflerGameFind';

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

export default handleGameNotExists;
