import { Router } from "express";
import handleLogOut from "../controllers/handleLogOut.js";

const router=Router();
router.post('/',handleLogOut);

export default router;