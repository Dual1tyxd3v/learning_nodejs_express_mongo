const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const TEN_MINUTES_IN_MS = 10 * 60 * 1000;

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
  role: {
    type: String,
    enum: {
      values: ['user', 'guide', 'lead-guide', 'admin'],
      message: 'Invalid role property'
    },
    default: 'user'
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
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordTokenExpired: Date
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

userSchema.methods.passwordWasChanged = function(tokenTime) {
  if (this.passwordChangedAt) {
    const changedTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return changedTime > tokenTime;
  }  

  return false;
}

userSchema.methods.createResetToken = function() {
  const token = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
  this.passwordTokenExpired = Date.now() + TEN_MINUTES_IN_MS;
  console.log(this.passwordResetToken, 'encrypted');
  console.log(token, 'token');
  return token;
}

const User = mongoose.model('User', userSchema);

module.exports = User;