const express = require("express");
const router = express.Router();
const {ensureauthenticated,ensureManager} = require("../middleware/auth");

const StockModel = require("../models/stockModel");
const StockrecordModel = require("../models/stockrecordModel");

// also here after the route ensureManager
router.get("/stock", (req, res)=>{
    res.render("stock");
});

// paste this before  the  sync ensureManager
router.post("/stock", async (req, res) => {
  try {
    const { productName, productType, quantity, costPrice, supplierName , dateBought,quality,color,measurements,phoneNumber } = req.body;
   
     // 1. Automatically calculate productPrice using a default markup (e.g., 30%)
    const markupPercentage = 30; // 30% profit
    const productPrice = Number(costPrice) * (1 + markupPercentage / 100);


    // Try to find an existing stock item with the same product name and type
    let stock = await StockModel.findOne({ productName, productType });
    if (stock) {
      // If it exists, update the quantity 
      stock.quantity += Number(quantity);
       stock.productPrice = productPrice;  // update to latest selling price
      stock.costPrice = Number(costPrice); // update latest cost 
      await stock.save();
    } else {
      // Otherwise, create a new stock entry
      stock = new StockModel({
        productName,
        productType,
        quantity: Number(quantity),
        costPrice : Number(costPrice) ,   // costPrice is sent like a number to the db
        productPrice,
      supplierName,
      dateBought,
      quality,
      color,
      measurements,
      phoneNumber
      });
      await stock.save();
    }

    // 2. Always log a new supply record in StockrecordModel
    const stockRecord = new StockrecordModel({
      productName,
      productType,
      quantity : Number(quantity),
      costPrice : Number(costPrice),
      productPrice,
      supplierName,
      dateBought,
      quality,
      color,
      measurements,
      phoneNumber
    });

    await stockRecord.save();
   //set  a flash message
    req.flash('success_msg', `Stock for "${productName}" added successfully!`);

    res.redirect("/stockrecords");      //redirect to the stockrecord tosee what is added instead of stocktable
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error adding stock. Please try again.');
    res.redirect("/stock");
  }
});

// getting stock from the database
router.get("/stocklist", async (req, res)=>{
    try {
        let items = await StockModel.find().sort({ $natural: -1 });

        res.render("stocktable", { items }) 
    } catch (error) {
       res.status(400).send("Unable to get data from the database."); 
    }
});
//getting stock records from the database
// router.get("/stockrecords", async (req, res)=>{
//     try {
//         let items = await StockModel.find().sort({ $natural: -1 })
//         res.render("stocktable2", { items }) 
//     } catch (error) {
//        res.status(400).send("Unable to get data from the database."); 
//     }
// });
// getting stock records from the database
router.get("/stockrecords", async (req, res) => {
  try {
    let items = await StockrecordModel.find().sort({ dateBought: -1 });
    res.render("stocktable2", { items });
  } catch (error) {
    res.status(400).send("Unable to get stock records.");
  }
});


//updating stock
router.get("/editstock/:id", async (req, res) => {
  let item = await StockModel.findById(req.params.id);
  // console.log(item)
  res.render(`editstock`, { item });
});
router.put("/editstock/:id",  async (req, res) => {
  try {
    const product = await StockModel.findByIdAndUpdate(
      req.params.id,
      req.body,                     //what has been changed, and thats the bodyform which was updated.
      { new: true }
    );
    if (!product) {
      return res.status(404).send("product not found.");
    }
    res.redirect("/stocklist");
  } catch (error) {}
});


//deleting route
router.post("/deletestock",   async(req, res)=>{
  try {
       await StockModel.deleteOne({_id:req.body.id});
      res.redirect("/stocklist")
  } catch (error) {
    console.log(error.message)
    res.status(400).send('Unable to delete item from the database.')
  }
});













module.exports = router;