import { body, validationResult } from "express-validator";

const validationFields = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email address is required")
    .bail()
    .isEmail()
    .withMessage("Enter a valid email address"),

  body("password").notEmpty().withMessage("Password is required"),
];
const validate = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  res.render("login", {
    user: null,
    formErrors:errors.mapped(),
    formValues: {email:req.body.email},
  });
};

export { validate, validationFields };
