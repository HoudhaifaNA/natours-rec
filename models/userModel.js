const cryptp = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a validate email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'admin',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be greater than 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // IT WORKS ONLY IF DOCUMENT IS CREATE OR SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same !',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

//////////////////////////////////////
///////////////////

userSchema.pre('save', async function (next) {
  // Run this only if password is modified
  if (!this.isModified('password')) return next();

  // Hash the Password
  this.password = await bcrypt.hash(this.password, 12);
  // Remove the confirmed password
  this.passwordConfirm = undefined;
});

//////////////////////////////////////
///////////////////

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//////////////////////////////////////
///////////////////

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

//////////////////////////////////////
///////////////////

userSchema.methods.correctPassword = async function (
  condidatePassword,
  userPassword
) {
  return await bcrypt.compare(condidatePassword, userPassword);
};

//////////////////////////////////////
///////////////////

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const passwordChangedAt = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(this.passwordChangedAt, JWTTimeStamp);
    return JWTTimeStamp < passwordChangedAt;
  }

  return false;
};

//////////////////////////////////////
///////////////////

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = cryptp.randomBytes(32).toString('hex');
  this.passwordResetToken = cryptp
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60000;

  console.log({ resetToken }, this.passwordResetToken);

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
