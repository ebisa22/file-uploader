const notFoundHandler = (req, res, next) => {
  const error = new Error(`Page not found: ${req.originalUrl}`);
  error.status = 404;

  next(error);
};

export default notFoundHandler;
