function errorHandler(err, req, res, next) {
  console.error(`Error processing ${req.method} ${req.url}:`, err.stack || err);

  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}

export default errorHandler;