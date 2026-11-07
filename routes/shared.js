import { Router } from "express";
import getFoldersPage from "../controllers/folders/getFoldersPage.js";

const router=Router();

router.get('/',getFoldersPage);

export default router;