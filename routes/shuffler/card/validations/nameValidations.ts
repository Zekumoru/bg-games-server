import { body } from 'express-validator';

const nameValidations = body('name')
  .trim()
  .toLowerCase()
  .notEmpty()
  .withMessage(`name is required`)
  .isLength({ max: 3000 })
  .withMessage(`name cannot have more than 3000 characters`)
  .escape();

export default nameValidations;
