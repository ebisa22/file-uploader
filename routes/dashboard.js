import { Router } from "express";
import getDashboardPage from "../controllers/getDashboardPage.js";


const router=Router();

router.get('/',getDashboardPage);


export default router;