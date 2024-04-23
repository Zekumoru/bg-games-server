import { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';

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

export default handleValidId;
