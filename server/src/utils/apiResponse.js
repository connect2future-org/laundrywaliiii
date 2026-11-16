export const sendSuccess = (res, { statusCode = 200, message = null, data = null, meta = null } = {}) => {
  const payload = {
    success: true,
    ...(message ? { message } : {}),
    ...(meta ? { meta } : {}),
    ...(data && typeof data === 'object' && !Array.isArray(data) ? data : data !== null ? { data } : {})
  };
  return res.status(statusCode).json(payload);
};

export const normalizeMongoUriWithEncoding = (uri = '') => {
  return String(uri).trim();
};

