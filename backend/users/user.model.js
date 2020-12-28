const { boolean } = require('joi');
const mongoose = require('mongoose');
const validator = require('validator')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        trim:true,
        lowercase:true, 
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email');
            }
        }   
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    }
})

userSchema.statics.isUserExist = async (email) =>{
    const user = await User.findOne({ email });
    return !!user;
}

const User = mongoose.model('User',userSchema);

module.exports = User;