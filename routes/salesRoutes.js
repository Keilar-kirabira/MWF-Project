const express = require("express");
const router = express.Router();
const { ensureauthenticated, ensureManager } = require("../middleware/auth");
const salesModel = require("../models/salesModel");
const stockModel = require("../models/stockModel");

router.get("/Addsale", async (req, res) => {
  try {
    const stocks = await stockModel.find(); //get all suppliers from the database.
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
    if (!stock) {
      return res.status(400).send("Stock not found.");
    }
    if (stock.quantity < Number(quantity)) {
      return res
        .status(400)
        .send(`Insufficent stock, only${stock.quantity} available.`); //to avoid selling little stock or nothing
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
      await sale.save();

      //decrease quantity from the stock collection
      stock.quantity -= quantity
      console.log("New quantity after sale", stock.quantity)
      await stock.save();
      res.redirect("/saleslist");
    }else{
        return res.status(404).send("Product not found or soldout .")
    }
  } catch (error) {
    console.error(error);
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

module.exports = router;
