import { Router } from "express";
import getSharedPage from "../controllers/shared/getSharedPage.js";
import createSharedFolder from "../controllers/shared/createSharedFolder.js";
import revokeSharedFolder from "../controllers/shared/revokeSharedFolder.js";
const router=Router();

router.get('/',getSharedPage);
router.post('/',createSharedFolder);
router.post("/:shareId/revoke",revokeSharedFolder);

export default router;