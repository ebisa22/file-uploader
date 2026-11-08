const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;

  const isProduction = process.env.NODE_ENV === "production";

  const isNotFound = statusCode === 404;

  res.status(statusCode).render("error", {
    title: isNotFound ? "Page Not Found" : "Something Went Wrong",
    statusCode,
    heading: isNotFound
      ? "We couldn't find that page."
      : "Something went wrong.",
    message: isNotFound
      ? "The page you're looking for doesn't exist or may have been moved."
      : "An unexpected error occurred while processing your request.",
    user: req.user || null,
    error: isProduction ? null : err,
  });
};

export default errorHandler;
