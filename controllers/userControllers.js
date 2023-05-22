const asyncErrorHandler = require('./../utils/asyncErrorHandler');
const crypto = require('crypto');
const User = require('./../model/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const { promisify } = require('util');
const sendEmail = require('../utils/email');

const getToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });
};

exports.getUsers = asyncErrorHandler(async (req, res) => {
  const users = await User.find();

  res.json({
    status: 'success',
    time: req.reqTime,
    counts: users.length,
    data: {
      users
    }
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'resource is not ready yet'
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'resource is not ready yet'
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'resource is not ready yet'
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'resource is not ready yet'
  });
};

exports.signup = asyncErrorHandler(async (req, res, next) => {
  const { name, email, password, passwordConfirm, passwordChangedAt, role } = req.body;
  const newUser = await User.create({
    name, email, password, passwordConfirm, passwordChangedAt, role
  });

  const token = getToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    user: newUser
  });
});

exports.login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  const token = getToken(user._id);
  res.status(201).json({
    status: 'success',
    token
  });
});

exports.protect = asyncErrorHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in!', 401));
  }
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decode.id);

  if (!user) {
    return next(new AppError('User does not exist', 401));
  }

  if (user.passwordWasChanged(decode.iat)) {
    return next(new AppError('Password was changed! Try login again', 401));
  }

  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You have no permissions for this'), 403);
    }

    next();
  }
};

exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email', 404));
  }
  const token = user.createResetToken();
  await user.save({ validateBeforeSave: false });

  const url = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${token}`;
  const message = `If you forgot your password please submit this link - ${url}\nIf you didn't forgot password please ignore this message`;
  try {
    await sendEmail({
      email: user.email,
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Email was send'
    });
  } catch(err) {
    user.passwordResetToken = undefined;
    user.passwordTokenExpired = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('Cant send email. Try again later'), 500);
  }
});

exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordTokenExpired: { $gt: Date.now() } });

  if (!user) {
    return next(new AppError('Invalid token or token has expired'), 400);
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordTokenExpired = undefined;
  await user.save();

  const token = getToken(user._id);
  res.status(201).json({
    status: 'success',
    token
  });
});
