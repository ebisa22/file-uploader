import { Router } from "express";
import getFoldersPage from "../controllers/folders/getFoldersPage.js";
import createFolder from "../controllers/folders/createFolder.js";
import getSubFolderPage from "../controllers/folders/getSubFolderPage.js";
import renameFolder from "../controllers/folders/renameFolder.js";
import deleteFolder from "../controllers/folders/deleteFolder.js";
import moveFolder from "../controllers/folders/moveFolder.js";
import getMoveFolderPage from "../controllers/folders/getMoveFolderPage.js";
const router=Router();

router.get('/',getFoldersPage);
router.post('/',createFolder);
router.get('/:folderId',getSubFolderPage);
router.get('/:folderId/move',getMoveFolderPage);
router.post('/:folderId/rename',renameFolder);
router.post('/:folderId/delete',deleteFolder);
router.post('/:folderId/move',moveFolder);
export default router;