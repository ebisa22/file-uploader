import { Router } from "express";
import getSignUpPage from "../controllers/getSignUpPage.js";
import { validate, validationFields } from "../signup-validator.js";
import createUser from "../controllers/createUser.js";

const router=Router();

router.get("/", getSignUpPage);
router.post("/", validationFields, validate, createUser);

export default router;