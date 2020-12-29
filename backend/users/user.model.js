const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: () =>{
        return this.authType === 'email'
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
      required: () =>{
          return this.authType === 'email'
      }
    },
    accStatus:{
        type:String,
        enum:['active','inactive','suspended'],
        required:true,
        default:'inactive',
        lowercase:true
    },
    authType:{
        type:String,
        enum:['email','google'],
        required:true
    }
  },
  {
    timestamps: true
  }
);

userSchema.statics.isUserExist = async email => {
  const user = await User.findOne({ email });
  return !!user;
};

userSchema.statics.isPasswordValid = async pass => {
  const options = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    returnScore: true,
    pointsPerUnique: 1,
    pointsPerRepeat: 0.5,
    pointsForContainingLower: 10,
    pointsForContainingUpper: 10,
    pointsForContainingNumber: 10,
    pointsForContainingSymbol: 10
  };
  console.log(pass && validator.isStrongPassword(pass, options));
  if (pass && pass.length >= 8) {
    return validator.isStrongPassword(pass, options) > 35 ? true : false;
  } else {
    return false;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
