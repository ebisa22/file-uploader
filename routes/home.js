import { Router } from "express";
import getHomePage from "../controllers/getHomePage.js";
import getSignUpPage from "../controllers/getSignUpPage.js";
import {validate,validationFields} from '../signup-validator.js';
import createUser from "../controllers/createUser.js";

const router=Router();

router.get('/',getHomePage);
router.get('/signup',getSignUpPage)
router.post('/signup',validationFields,validate,createUser);

export default router;