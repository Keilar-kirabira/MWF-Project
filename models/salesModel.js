const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
customerName :{
    type : String,
    required : true
},
productType :{
    type : String,
    required : true
},
productName :{ 
    type : String,
    required : true
},
quantity:{
    type : Number,
    required : true
},
unitPrice:{
    type : Number,
    required : true
},
totalPrice: {
    type: Number,
    required: true
  },
transportCheck:{
    type : Boolean,
    default: false,
},
paymentType :{
    type : String,
    required : true
},
paymentDate :{
    type : Date,
    required : true
}, 
salesagent:{
    type : String,
    required : true
}   
});

module.exports = mongoose.model("SaleModel",salesSchema)