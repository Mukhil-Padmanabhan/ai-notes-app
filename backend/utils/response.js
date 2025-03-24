const sendSuccess = (res, statusCode = 200, data = {}, message = 'Success', ) => {
    return res.status(statusCode).json({
      statusCode,
      status: 'Success',
      message,
      data,
    });
  };
  
  const sendError = (res, statusCode = 500, message = 'Something went wrong',extra = {}) => {
    return res.status(statusCode).json({
      statusCode,
      status: 'Error',
      message,
      ...extra,
    });
  };
  
  const sendUnauthorized = (res, message = 'Invalid or expired token') => {
    return res.status(401).json({
      statusCode: 401,
      status: 'Unauthorized',
      message,
    });
  };
  
  const sendBadRequest = (res, message = 'Bad request') => {
    return res.status(400).json({
      statusCode: 400,
      status: 'Bad Request',
      message,
    });
  };

  const sendNotFound = (res, message = 'Bad request') => {
    return res.status(404).json({
      statusCode: 404,
      status: 'Not Found',
      message: 'Note not found',
    });
  };
  
  module.exports = {
    sendSuccess,
    sendError,
    sendUnauthorized,
    sendBadRequest,
    sendNotFound
  };
  