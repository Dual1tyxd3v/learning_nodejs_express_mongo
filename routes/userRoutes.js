const express = require('express');
const { getUsers, createUser, getUser, updateUser, deleteUser, signup, login, forgotPassword, resetPassword, protect, updatePassword, } = require('./../controllers/userControllers');

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/forgotPassword', forgotPassword);
userRouter.patch('/resetPassword/:token', resetPassword);
userRouter.patch('/updatePassword', protect, updatePassword);
userRouter.route('/')
  .get(getUsers)
  .post(createUser);
userRouter.route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = userRouter;