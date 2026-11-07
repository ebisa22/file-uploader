import { Router } from "express";
import getHomePage from "../controllers/getHomePage.js";
import signUpRouter from './signup.js';
import logInRouter from './login.js';

const router=Router();

router.get('/',getHomePage);
router.use('/signup',signUpRouter)
router.use('/login',logInRouter)


export default router;