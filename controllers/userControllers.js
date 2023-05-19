const asyncErrorHandler = require('./../utils/asyncErrorHandler');
const User = require('./../model/userModel');

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
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    user: newUser
  });
});