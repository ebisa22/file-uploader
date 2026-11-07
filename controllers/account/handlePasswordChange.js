import { renderAccountPage } from "./renderAccountPage.js";
import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcryptjs";

const handlePasswordChange = async (req, res, next) => {
  if (req.validationErrors) {
    return renderAccountPage(req, res, {
      passwordErrors: req.validationErrors,
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.redirect("/account");
  } catch (err) {
    next(err);
  }
};

export default handlePasswordChange;
