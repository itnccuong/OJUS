import express from 'express';
const router = express.Router();
const { verifyToken } = require('../middlewares/verify-token');
// const { uploadFile } = require('../upload/upload-file');
import multer from 'multer';
const upload = multer({ dest: 'uploads/' }); // Specify the destination for uploaded files

import { searchContribute, getOneContribute, submitContribute, rejectContribute, acceptContribute} from '../controllers/contribute.controller';

router.use(verifyToken);

router.get('/search', searchContribute);
router.get('/:contribute_id', getOneContribute);
router.post('/', upload.single('file'), submitContribute);
router.post('/accept/:contribute_id', acceptContribute);
router.post('/reject/:contribute_id', rejectContribute);

export default router;