import { prisma } from "../../lib/prisma.js";

const getSecurityQuestion = async (req, res, next) => {
  const recovery = req.session.recovery;

  if (!recovery || recovery.expiresAt <= Date.now() || recovery.verified) {
    return res.redirect("/forgot-password");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: recovery.userId },
      select: { securityQuestion: true },
    });

    if (!user) {
      delete req.session.recovery;
      return res.redirect("/forgot-password");
    }

    res.render("forgot-password", {
      stage: "question",
      error: null,
      question: user.securityQuestion,
      errors: {},
    });
  } catch (err) {
    next(err);
  }
};

export default getSecurityQuestion;
