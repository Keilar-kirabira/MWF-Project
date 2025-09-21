const mongoose = require('mongoose');

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
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("UserModel",signupSchema) 