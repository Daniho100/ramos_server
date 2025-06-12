const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.set('Access-Control-Allow-Origin', 'https://ramos-client.vercel.app'); // Preserve CORS
  res.set('Access-Control-Allow-Credentials', 'true');
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};

export default errorHandler;