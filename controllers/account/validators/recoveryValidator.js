import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma.js";

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

const validate = (req, res, next) => {
  const errors = validationResult(req);
  req.validationErrors = errors.isEmpty() ? null : errors.mapped();
  next();
};

export { validate, validationFields };
