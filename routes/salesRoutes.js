const express = require("express");
const router = express.Router();
const { ensureauthenticated, ensureManager } = require("../middleware/auth");
const salesModel = require("../models/salesModel");
const stockModel = require("../models/stockModel");

router.get("/Addsale", async (req, res) => {
  try {
    const stocks = await stockModel.find(); //get all stock from the database.
    res.render("sales", { stocks }); //pass them to view
  } catch (error) {
    console.error(error.message);
  }
});

router.post("/Addsale", async (req, res) => {
  try {
    const {
      customerName,
      productType,
      productName,
      quantity,
      unitPrice,
      totalPrice,
      transportCheck,
      paymentType,
      paymentDate,
    } = req.body; //this data comes from the form
    const userId = req.session.user._id; // i want to pick the id for the salesagent
    const stock = await stockModel.findOne({
      productType: productType,
      productName: productName,
    }); // the 1st productType and name come from the stock module and the2nd from the sales module.
    // if (!stock) {
    //   return res.status(400).send("Stock not found.");
    // }
    // if (stock.quantity < Number(quantity)) {
    //   return res
    //     .status(400)
    //     .send(`Insufficent stock, only${stock.quantity} available.`); //to avoid selling little stock or nothing
    // }
    if (!stock) {
      req.flash("error_msg", "Stock not found.");
      return res.redirect("/Addsale");
    }

    if (stock.quantity < Number(quantity)) {
      req.flash(
        "error_msg",
        `Insufficient stock, only ${stock.quantity} available.`
      );
      return res.redirect("/Addsale");
    }
    let total = unitPrice * quantity;
    if (transportCheck) {
      total *= 1.05; //Add transport 1+5%
    }
    if (stock && stock.quantity > 0) {
      const sale = new salesModel({
        customerName,
        productType,
        productName,
        quantity,
        unitPrice,
        totalPrice: total,
        transportCheck: !!transportCheck,
        paymentType,
        paymentDate,
        salesAgent: userId,
      });
      console.log("saving sale:", sale);
      console.log(userId);
      console.log('Session user:', req.session.user)
      await sale.save();

      //decrease quantity from the stock collection
      stock.quantity -= quantity
      console.log("New quantity after sale", stock.quantity)
      await stock.save();
      req.flash("success_msg", "Sale added successfully!");
      res.redirect("/saleslist");
    }else{
        return res.status(404).send("Product not found or soldout .")
    }
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error adding sale. Please try again.");
    res.redirect("/Addsale");
  }
});

//route for getting sales data from the db to the table
router.get("/saleslist", async (req, res) => {
  try {
    const sales = await salesModel.find().populate("salesAgent", "userName"); //populate method helps to expose details about the salesAgent forexample userName.and . find brings back everthing
    const currentUser = req.session.user;
    console.log(currentUser); //person acessing the sales records.
    res.render("salestable", { sales, currentUser });
  } catch (error) {
    console.error(error.message);
    res.redirect("/");
  }
});

// //updating sales
router.get("/editsales/:id", async (req, res) => {
  try {
    const sale = await salesModel.findById(req.params.id);
    const stocks = await stockModel.find();

  res.render(`editsales`, { sale, stocks });
  } catch (error) {
     console.error(error.message);
    req.flash("error_msg", "Error loading sale for edit.");
    res.redirect("/saleslist");
  }
  
});
router.put("/editsales/:id",  async (req, res) => {
  try {
    const updatedSale = await salesModel.findByIdAndUpdate(
      req.params.id,
      req.body,                     //what has been changed, and thats the bodyform which was updated.
      { new: true }
    );
    if (!updatedSale) {
      req.flash("error_msg", "Sale not found.");
      return res.redirect("/saleslist");
    }
     req.flash("success_msg", "Sale updated successfully!");
    res.redirect("/saleslist");
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error updating sale.");
    res.redirect("/saleslist");

  }
});


//delete
router.post("/deletesales",   async(req, res)=>{
  try {
       await salesModel.deleteOne({_id:req.body.id});
       req.flash("success_msg", "Sale deleted successfully!"); 
      res.redirect("/saleslist")
  } catch (error) {
    console.log(error.message)
   req.flash("error_msg", "Unable to delete sale.");
    res.redirect("/saleslist");
  }
});




//receipt
router.get("/getReceipt/:id", async (req, res) => {
  try {
    //Sales agent only sees their own sales
    const sale = await salesModel.findOne({_id:req.params.id}).populate("salesAgent", "userName");
    res.render("receipt", { sale });
  } catch (error) {
    console.error(error.message);
    res.status(400).send("Unable to find a sale.")
  }
});




module.exports = router;
