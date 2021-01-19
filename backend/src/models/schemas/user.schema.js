const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: () => {
        return this.authType === 'email';
      }
    },
    email: {
      type: String,
      require: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: v => {
          return validator.isEmail(v);
        },
        message: props => `${props.value} is not valid email`
      }
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    pass: {
      type: String,
      required: () => {
        return this.authType === 'email';
      }
    },
    accStatus: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      required: true,
      default: 'inactive',
      lowercase: true
    },
    authType: {
      type: String,
      enum: ['email', 'google'],
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = userSchema;
