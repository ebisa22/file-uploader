import {Router} from 'express';
import handleUpload from '../controllers/files/handleUpload.js';
import multer from "multer";
const upload=multer({
    dest:'uploads/'
})
const router=Router();

router.post('/upload',upload.single('file'),handleUpload);

export default router;