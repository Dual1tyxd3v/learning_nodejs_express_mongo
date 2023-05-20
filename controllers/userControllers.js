const asyncErrorHandler = require('./../utils/asyncErrorHandler');
const User = require('./../model/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');

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
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    name, email, password, passwordConfirm
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
