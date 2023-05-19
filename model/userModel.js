const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'User name cant be so long (40 characters max)'],
    minlength: [2, 'User name must have 2 or more characters']
  },
  email: {
    type: String,
    required: [true, 'User must have a email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invlid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'User must have a password'],
    select: false,
    minlength: [8, 'Your password is too short']
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Password confirm was failed'
    }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;