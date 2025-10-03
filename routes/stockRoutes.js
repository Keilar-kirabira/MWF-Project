const express = require("express");
const router = express.Router();
const {ensureauthenticated,ensureManager} = require("../middleware/auth");

const StockModel = require("../models/stockModel");
const StockrecordModel = require("../models/stockrecordModel");
const Supplier = require("../models/supplierModel");                  //supplier to helpme get their names and phonenumber
// also here after the route ensureManager
router.get("/stock", async (req, res)=>{
  try {
    const suppliers = await Supplier.find();
    res.render("stock", {suppliers});         //getting info of the supplier
  } catch (error) {
    console.error(error);
    res.redirect("/")
  }
    
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
      stock.supplierName = supplierName;
      stock.phoneNumber = phoneNumber;
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


// // //updating stock
// router.get("/editstock/:id", async (req, res) => {
//   // let item = await StockModel.findById(req.params.id);
//    const item = await StockrecordModel.findById(req.params.id);
//    const suppliers = await Supplier.find();
//   // console.log(item)
//   res.render(`editstock`, { item, suppliers });
// });
// router.put("/editstock/:id",  async (req, res) => {
//   try {
//     const product = await StockrecordModel.findByIdAndUpdate(
//       req.params.id,
//       req.body,                     //what has been changed, and thats the bodyform which was updated.
//       { new: true }
//     );
//     if (!product) {
//       return res.status(404).send("product not found.");
//     }
//     // res.redirect("/stocklist");
//     res.redirect("/stockrecords");
//   } catch (error) {}
// });

router.get("/editstock/:id", async (req, res) => {
  try {
    const item = await StockrecordModel.findById(req.params.id);
    if (!item) {
      req.flash('error_msg', 'Stock record not found.');
      return res.redirect('/stockrecords');
    }

    const suppliers = await Supplier.find();
    res.render("editstock", { item, suppliers });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error fetching stock record.');
    res.redirect('/stockrecords');
  }
});



// Updating stock
// // Updating stock
router.put("/editstock/:id", async (req, res) => {
  try {
    const {
      productName,
      productType,
      quantity,
      costPrice,
      productPrice,
      supplierName,
      phoneNumber,
      dateBought,
      quality,
      color,
      measurements
    } = req.body;

    // 1. Find the old stock record (historical record)
    const oldRecord = await StockrecordModel.findById(req.params.id);
    if (!oldRecord) return res.status(404).send("Stock record not found");

    // 2. Calculate difference in quantity
    const quantityDifference = Number(quantity) - oldRecord.quantity;

    // 3. Update the stock record (historical log)
    await StockrecordModel.findByIdAndUpdate(
      req.params.id,
      {
        productName,
        productType,
        quantity: Number(quantity),
        costPrice: Number(costPrice),
        productPrice: Number(productPrice),
        supplierName,
        phoneNumber,
        dateBought,
        quality,
        color,
        measurements
      },
      { new: true }
    );

    // 4. Update main stock table
    let stock = await StockModel.findOne({ productName, productType });

    if (stock) {
      // Add/subtract difference instead of replacing
      stock.quantity += quantityDifference;

      // Optional: update other details
      stock.costPrice = Number(costPrice);
      stock.productPrice = Number(productPrice);
      stock.supplierName = supplierName;
      stock.phoneNumber = phoneNumber;

      await stock.save();
    } else {
      // If product name/type changed, create new stock entry
      stock = new StockModel({
        productName,
        productType,
        quantity: Number(quantity),
        costPrice: Number(costPrice),
        productPrice: Number(productPrice),
        supplierName,
        phoneNumber,
        dateBought,
        quality,
        color,
        measurements
      });
      await stock.save();
    }

    req.flash('success_msg', `Stock for "${productName}" updated successfully!`);
    res.redirect("/stockrecords");
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error updating stock. Please try again.');
    res.redirect("/stockrecords");
  }
});



//deleting route
// router.post("/deletestock",   async(req, res)=>{
//   try {
//        await StockrecordModel.deleteOne({_id:req.body.id});
//       res.redirect("/stocklist")
//   } catch (error) {
//     console.log(error.message)
//     res.status(400).send('Unable to delete item from the database.')
//   }
// });

// Deleting a stock record
router.post("/deletestock", async (req, res) => {
  try {
    const recordId = req.body.id;

    // Find the stock record first
    const record = await StockrecordModel.findById(recordId);
    if (!record) {
      req.flash('error_msg', 'Stock record not found.');
      return res.redirect("/stockrecords");
    }

    //Update the main stock table
    const stock = await StockModel.findOne({ 
      productName: record.productName, 
      productType: record.productType 
    });

    if (stock) {
      // Reduce the quantity by the record's quantity
      stock.quantity -= record.quantity;

      // If quantity drops to zero or below, remove the stock completely
      if (stock.quantity <= 0) {
        await StockModel.deleteOne({ _id: stock._id });
      } else {
        await stock.save();
      }
    }

    // Delete the stock record
    await StockrecordModel.deleteOne({ _id: recordId });

    req.flash('success_msg', `Stock record for "${record.productName}" deleted successfully.`);
    res.redirect("/stockrecords");
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Unable to delete stock record. Please try again.');
    res.redirect("/stockrecords");
  }
});












module.exports = router;