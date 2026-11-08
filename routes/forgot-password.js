import { Router } from "express";

import getForgotPassword from "../controllers/forgot-password/getForgotPassword.js";
import findAccount from "../controllers/forgot-password/findAccount.js";
import getSecurityQuestion from "../controllers/forgot-password/getSecurityQuestion.js";
import verifySecurityAnswer from "../controllers/forgot-password/verifySecurityAnswer.js";
import getResetPassword from "../controllers/forgot-password/getResetPassword.js";
import resetPassword from "../controllers/forgot-password/resetPassword.js";

const router = Router();

router.get("/", getForgotPassword);
router.post("/", findAccount);

router.get("/security-question", getSecurityQuestion);
router.post("/security-question", verifySecurityAnswer);

router.get("/reset", getResetPassword);
router.post("/reset", resetPassword);

export default router;
