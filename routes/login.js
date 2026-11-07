import { Router } from "express";
import { validate, validationFields } from "../login-validator.js";
import getLogInPage from "../controllers/getLogInPage.js";
import handleLogin from "../controllers/handleLogin.js";

const router=Router();
router.get("/", getLogInPage);
router.post("/",validationFields,validate,handleLogin);

export default router;