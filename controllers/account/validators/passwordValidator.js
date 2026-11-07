import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma.js";

const checkConfirmPassword = (value, { req }) => {
  if (value !== req.body.newPassword) {
    throw new Error("Passwords don't match");
  }
  return true;
};

const checkCorrectPassword = async (value, { req }) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { password: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const correctPassword = await bcrypt.compare(value, user.password);

  if (!correctPassword) {
    throw new Error("Incorrect password");
  }

  return true;
};

const validationFields = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required")
    .bail()
    .custom(checkCorrectPassword),

  body("newPassword").isStrongPassword().withMessage("Enter a strong password"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your password")
    .bail()
    .custom(checkConfirmPassword),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  req.validationErrors = errors.isEmpty() ? null : errors.mapped();

  next();
};

export { validate, validationFields };
