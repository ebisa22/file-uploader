import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcryptjs";

const verifySecurityAnswer = async (req, res, next) => {
  const recovery = req.session.recovery;

  if (!recovery || recovery.expiresAt <= Date.now() || recovery.verified) {
    return res.redirect("/forgot-password");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: recovery.userId },
      select: {
        securityQuestion: true,
        securityAnswer: true,
      },
    });

    if (!user) {
      delete req.session.recovery;
      return res.redirect("/forgot-password");
    }

    const answer = req.body.securityAnswer?.trim().toLowerCase();

    if (!answer) {
      return res.status(400).render("forgot-password", {
        stage: "question",
        error: "Please enter your answer.",
        question: user.securityQuestion,
        errors: {},
      });
    }

    const isCorrect = await bcrypt.compare(answer, user.securityAnswer);

    if (!isCorrect) {
      return res.status(400).render("forgot-password", {
        stage: "question",
        error: "Incorrect answer. Please try again.",
        question: user.securityQuestion,
        errors: {},
      });
    }

    req.session.recovery.verified = true;
    req.session.recovery.expiresAt = Date.now() + 10 * 60 * 1000;

    req.session.save((err) => {
      if (err) return next(err);
      res.redirect("/forgot-password/reset");
    });
  } catch (err) {
    next(err);
  }
};

export default verifySecurityAnswer;
