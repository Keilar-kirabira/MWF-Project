const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const signupSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true 
    },
    email:{
       type:String,
       required:true,
       unique:true,
       trim:true
    },
    birthDate:{
      type : String,
      required:true
    },
    gender:{
      type:String,
      required:true
    },
    nin :{
      type : String,
      required : true,
      unique:true,
      trim : true
    },
    phoneNumber:{
       type: String,
       required : true,
       trim : true
    },
    role:{
        type:String,
        required:true
    },
    nextofKin:{
      type : String,
      required : true,
      trim : true
    },
    nokNumber:{
      type : String,
      required : true
    },
    employeeId:{
       type: String,
       required : true,
       unique:true,
       trim : true
    },
    profileImage:{
      type: String,
      default: "default.png"
    }
});
signupSchema.plugin(passportLocalMongoose,{
    usernameField:"email"
});                                                  
module.exports = mongoose.model("UserModel",signupSchema) 

// am using passport local, for local username and password authentication. but am going against the default to use email instead of username.
// password is by default so we donot sepecify it here.