import { Router } from 'express';
import multer from 'multer';
import {
  deployFromGithub,
  deployFromUpload,
  getDeploymentStatus,
} from '../controllers/deploy.controller.js';
import { ApiError } from '../utils/ApiError.js';

const MAX_UPLOAD_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

const ALLOWED_ZIP_MIMETYPES = new Set([
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream',
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_UPLOAD_SIZE_BYTES,
  },
  fileFilter: (_req, file, cb) => {
    const isZipExtension = file.originalname?.toLowerCase().endsWith('.zip');
    const isAllowedMime = ALLOWED_ZIP_MIMETYPES.has(file.mimetype);

    if (isZipExtension || isAllowedMime) {
      cb(null, true);
      return;
    }

    cb(new ApiError(400, 'Only .zip archive files are allowed'));
  },
});

const router = Router();

router.post('/github', deployFromGithub);
router.post('/upload', upload.single('file'), deployFromUpload);
router.get('/status/:deploymentId', getDeploymentStatus);

export default router;

