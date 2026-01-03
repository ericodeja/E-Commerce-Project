const errorHandler = (error, req, res, next) => {
  if (error.status) {
    res.status(error.status).json({
      error: {
        message: error.message,
      },
    });
  }

  res.status(500).json({
    error: {
      message:
        error.message || "An error occurred. Please view logs for more details",
    },
  });
};

export default errorHandler;
