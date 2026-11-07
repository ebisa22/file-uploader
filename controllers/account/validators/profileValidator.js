import {body,validationResult} from 'express-validator';
import {prisma} from '../../../lib/prisma.js';

const checkUsernameAvailability = async (value, { req }) => {
  const user = await prisma.user.findUnique({
    where: { email: value },
  });

  if (user && user.id !== req.user.id) {
    throw new Error("Email already registered");
  }
};

 
const validationFields = [
  body("firstName")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("First name required"),
  body("lastName")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Last name required"),
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Enter valid email address")
    .bail()
    .custom(checkUsernameAvailability)
    .withMessage("Email already registered"),
];

const validate = async (req, res, next) => {
  const values = req.body;
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    req.validationErrors = null;
    return next();
  }else{
    req.validationErrors=errors.mapped();
  }
  next()
};

export { validate, validationFields };
