import {Router} from 'express';
import handleUpload from '../controllers/files/handleUpload.js';
import renameFile from '../controllers/files/renameFile.js';
import deleteFile from '../controllers/files/deleteFile.js';
import getMoveFilePage from '../controllers/files/getMoveFilePage.js';
import moveFile from '../controllers/files/moveFile.js';
import downloadFile from '../controllers/files/downloadFile.js';
import multer from "multer";

 const upload = multer({
   storage: multer.memoryStorage(),
   limits: {
     fileSize: 10 * 1024 * 1024,
   },
 });
const router=Router();

router.post('/upload',upload.single('file'),handleUpload);
router.post('/:fileId/rename',renameFile);
router.post('/:fileId/delete',deleteFile);
router.get('/:fileId/move',getMoveFilePage);
router.post('/:fileId/move',moveFile);
router.get("/:fileId/download",downloadFile);
export default router;