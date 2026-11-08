import { Router } from "express";
import getHomePage from "../controllers/getHomePage.js";
import signUpRouter from './signup.js';
import logInRouter from './login.js';
import handleSharedAccess from "../controllers/handleSharedAccess.js";
import downloadSharedFile from "../controllers/shared/downloadSharedFile.js";

const router=Router();

router.get('/',getHomePage);
router.use('/signup',signUpRouter)
router.use('/login',logInRouter)

router.get("/share/:shareToken", handleSharedAccess);
router.get("/share/:shareToken/folders/:folderId", handleSharedAccess);
router.get("/share/:shareToken/files/:fileId/download",downloadSharedFile);
export default router;