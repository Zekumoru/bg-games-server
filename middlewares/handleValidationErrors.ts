import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

const handleValidationErrors = (errMessage: string) => {
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

export default handleValidationErrors;
