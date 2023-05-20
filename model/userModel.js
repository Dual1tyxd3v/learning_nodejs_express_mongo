const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.checkPassword = async function(inputPass, dbPass) {
  return await bcrypt.compare(inputPass, dbPass);
}

const User = mongoose.model('User', userSchema);

module.exports = User;