const mongoose = require('mongoose');
const supplierSchema = new mongoose.Schema({
 supplierName: {
    type : String,
    required : true
 },
 supplierCategory: {
   type : String,
   required : true
 },
  productName: {
   type : String,
   required : true
 },
  quantity: {
   type : Number,
   required : true
 },
  dateSupplied:{
        type:Date,
        required:true
    },
  phoneNumber: {
   type : Number,
   required : true
 },
  email: {
   type : String,
   required : true,
   trim : true,
 },
  physicaladdress: {
   type: String,
   required : true,
  },
  // status: {
  //  type:String,
  //  required : true
  // }
   
});


module.exports = mongoose.model("SupplierModel",supplierSchema)