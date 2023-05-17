class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.statusCode = code;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOptional = true; 

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;