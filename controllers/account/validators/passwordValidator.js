import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma.js";

const checkConfirmPassword = async (value, { req }) => {
  if (value !== req.body.password) {
    throw new Error("Passwords don't match");
  }
  return true;
};
const checkCorrectPassword = async (value, { req }) => {
  const { password } = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    select: {
      password: true,
    },
  });
  const correctPassword = await bcrypt.compare(password, value);
  if (!correctPassword) {
    throw new Error("Incorrect password");
  }
  return true;
};
const validationFields = [
  body("currentPassword")
    .custom(checkCorrectPassword)
    .withMessage("Incorrect Password"),
  body("newPassword").isStrongPassword().withMessage("Enter strong password"),
  body("confirmPassword")
    .custom(checkConfirmPassword)
    .withMessage("Passwords don't match"),
];

const validate = async (req, res, next) => {
  const values = req.body;
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    req.validationErrors = null;
    return next();
  } else {
    req.validationErrors = errors.mapped();
  }
  next();
};

export { validate, validationFields };