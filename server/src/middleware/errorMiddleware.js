export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const notFoundHandler = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details || null;

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid identifier format for ${err.path}`;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Database validation failed';
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message
    }));
  } else if (err.code === 11000) {
    statusCode = 409;
    const duplicateFields = Object.keys(err.keyPattern || {});
    message = `Duplicate value for unique field(s): ${duplicateFields.join(', ') || 'record'}`;
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired authentication token';
  }

  const responseBody = {
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(process.env.NODE_ENV === 'development' && statusCode === 500 ? { stack: err.stack } : {})
  };

  res.status(statusCode).json(responseBody);
};

