import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcryptjs";

const resetPassword = async (req, res, next) => {
  const recovery = req.session.recovery;

  if (!recovery || !recovery.verified || recovery.expiresAt <= Date.now()) {
    return res.redirect("/forgot-password");
  }

  const { password, confirmPassword } = req.body;
  const errors = {};

  if (!password) {
    errors.password = "Password is required.";
  } else if (
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[^A-Za-z0-9]/.test(password)
  ) {
    errors.password =
      "Use at least 8 characters, including uppercase, lowercase, a number, and a special character.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).render("forgot-password", {
      stage: "reset",
      error: null,
      question: null,
      errors,
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: recovery.userId },
      data: { password: hashedPassword },
    });

    req.session.destroy((err) => {
      if (err) return next(err);
      res.redirect("/login");
    });
  } catch (err) {
    next(err);
  }
};

export default resetPassword;
