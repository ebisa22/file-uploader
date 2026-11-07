import {body,validationResult} from 'express-validator';
import {prisma} from './lib/prisma.js';

const securityQuestions = [
  "What was the name of your first school?",
  "What was the name of your childhood best friend?",
  "What city were you born in?",
  "What was your childhood nickname?",
  "What was the name of your first pet?",
  "What was your favorite childhood food?",
  "What was the first concert you attended?",
  "What was the name of your favorite childhood teacher?",
];
const checkUsernameAvailability = async (value) => {
  try {
    const user = await prisma.user.findUnique({
        where:{
            email:value
        }
    });
    if (user) throw new Error("Email already exist");
    else return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const checkConfirmPassword = async (value, { req }) => {
  if (value !== req.body.password) {
    throw new Error("Passwords don't match");
  }

  return true;
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
  body("password").isStrongPassword().withMessage("Enter strong password"),
  body("confirmPassword")
    .custom(checkConfirmPassword)
    .withMessage("Passwords don't match"),
  body("securityQuestion")
    .trim()
    .isIn(securityQuestions)
    .withMessage("Select a valid security question"),
  body("securityAnswer")
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage("Security answer required"),
];

const validate = async (req, res, next) => {
  const values = req.body;
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  res.render("signup", {
    user: null,
    formErrors: errors.mapped(),
    formValues: {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      securityQuestion: values.securityQuestion,
    },
    securityQuestions,
  });
};

export { validate, validationFields };
