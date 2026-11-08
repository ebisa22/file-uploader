import { prisma } from "../../lib/prisma.js";

const RECOVERY_DURATION = 10 * 60 * 1000;

const findAccount = async (req, res, next) => {
  const email = req.body.email?.trim().toLowerCase();

  if (!email) {
    return res.status(400).render("forgot-password", {
      stage: "email",
      error: "Please enter your email address.",
      question: null,
      errors: {},
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        securityQuestion: true,
      },
    });

    if (!user) {
      return res.status(404).render("forgot-password", {
        stage: "email",
        error: "No account found with that email address.",
        question: null,
        errors: {},
      });
    }

    req.session.regenerate((err) => {
      if (err) return next(err);

      req.session.recovery = {
        userId: user.id,
        verified: false,
        expiresAt: Date.now() + RECOVERY_DURATION,
      };

      req.session.save((saveErr) => {
        if (saveErr) return next(saveErr);
        res.redirect("/forgot-password/security-question");
      });
    });
  } catch (err) {
    next(err);
  }
};

export default findAccount;
