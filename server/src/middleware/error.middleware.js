import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

/**
 * Centralized Express error-handling middleware.
 * Returns a consistent JSON structure without leaking secrets or stack traces.
 */
export function errorMiddleware(err, _req, res, _next) {
  let statusCode = 500;
  let message = 'Internal server error';
  let details;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      statusCode = 413;
      message = 'Uploaded file exceeds the 50 MB limit';
    } else {
      statusCode = 400;
      message = err.message || 'Invalid multipart file upload';
    }
  } else if (err instanceof SyntaxError && err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON request body';
  } else if (err?.statusCode && Number.isInteger(err.statusCode)) {
    statusCode = err.statusCode;
    message = err.message || message;
  }

  if (statusCode >= 500) {
    console.error(`[Error ${statusCode}] ${err?.message || 'Unexpected error'}`);
  }

  const payload = {
    success: false,
    message,
  };

  if (details !== undefined) {
    payload.details = details;
  }

  res.status(statusCode).json(payload);
}

