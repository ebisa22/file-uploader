import { Router } from "express";
import getAccountPage from "../controllers/account/getAccountPage.js";
import {
  validationFields as profileValidationFields,
  validate as profileValidate,
} from "../controllers/account/validators/profileValidator.js";
import {
  validationFields as passwordValidationFields,
  validate as passwordValidate,
} from "../controllers/account/validators/passwordValidator.js";

import handleProfileChange from "../controllers/account/handleProfileChange.js";
import handlePasswordChange from "../controllers/account/handlePasswordChange.js";
const router=Router();

router.get('/',getAccountPage);
router.post('/profile',profileValidationFields,profileValidate,handleProfileChange);
router.post('/password',passwordValidationFields,passwordValidate,handlePasswordChange)
export default router;