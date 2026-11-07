import { renderAccountPage } from "./renderAccountPage.js";
import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcryptjs";

const handleRecoveryChange = async (req, res, next) => {
  if (req.validationErrors) {
    return renderAccountPage(req, res, {
      securityErrors: req.validationErrors,
    });
  }

  try {
   const hashedSecurityAnswer=await bcrypt.hash(req.body.securityAnswer,10);
   await prisma.user.update({
      where: { id: req.user.id },
      data: { 
        securityQuestion:req.body.securityQuestion,
        securityAnswer:hashedSecurityAnswer
       },
    });

    res.redirect("/account");
  } catch (err) {
    next(err);
  }
};

export default handleRecoveryChange;
