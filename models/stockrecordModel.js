const mongoose = require('mongoose');

const stockrecordSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true 
    },
    productType:{
       type:String,
       required:true,
    },
    quantity:{
        type:Number,
        required:true
    },
    costPrice:{
        type:Number,
        required:true
    },
     productPrice:{
        type:Number,
        required:true
    },
    supplierName:{
        type:String,
        required:true
    },
    dateBought:{
        type:Date,
        required:true
    },
    quality:{
        type:String,
        required:true
    },
    color:{
        type:String,
    },
    measurements:{
        type:String,
    },
     phoneNumber:{
       type: String,
       required : true,
       trim : true,
    },
    totalCost: {
    type: Number,
    
}
});


// Pre-save hook to calculate totalCost
stockrecordSchema.pre('save', function(next) {
    this.totalCost = this.costPrice * this.quantity;
    next();
});

module.exports = mongoose.model("Stockrecord",stockrecordSchema)