const asyncErrorHandler = require('./../utils/asyncErrorHandler');
const User = require('./../model/userModel');
const jwt = require('jsonwebtoken');

exports.getUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'resource is not ready yet'
  });
};

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
  const {name, email, password, passwordConfirm} = req.body;
  const newUser = await User.create({
    name, email, password, passwordConfirm
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  })

  res.status(201).json({
    status: 'success',
    token,
    user: newUser
  });
});