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

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = {...err};

    if (err.name === 'CastError') {
      error = castErrorHandler(error);
    }
    if (err.code === 11000) {
      error = duplicateFieldHandler(err);
    }

    sendErrorProd(error, res);
  }
};
