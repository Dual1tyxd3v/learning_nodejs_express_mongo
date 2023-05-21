const AppError = require('./../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOptional) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};

const castErrorHandler = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const duplicateFieldHandler = err => {
  const message = `Duplicate - ${err.message.split('{')[1].split('}')[0]}`;
  return new AppError(message, 400);
}

const validationErrorHandler = err => {
  const errors = Object.values(err.errors).map(error => error.message);
  return new AppError(`Invalid input data. ${errors.join('. ')}`, 400);
};

const jwtTokenErrorHandler = () => new AppError('Invalid token', 401);

const jwtExpiredErrorHandler = () => new AppError('Token was expired', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') {
      error = castErrorHandler(error);
    }
    if (err.code === 11000) {
      error = duplicateFieldHandler(err);
    }
    if (err.name === 'ValidationError') {
      error = validationErrorHandler(error);
    }
    if (err.name === 'JsonWebTokenError') {
      error = jwtTokenErrorHandler();
    }
    if (err.name === 'TokenExpiredError') {
      error = jwtExpiredErrorHandler();
    }

    sendErrorProd(error, res);
  }
};
