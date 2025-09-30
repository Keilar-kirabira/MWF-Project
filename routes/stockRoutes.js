const express = require("express");
const router = express.Router();
const {ensureauthenticated,ensureManager} = require("../middleware/auth");

const StockModel = require("../models/stockModel");

// also here after the route ensureManager
router.get("/stock", (req, res)=>{
    res.render("stock");
});
// paste this before  the  sync ensureManager
router.post("/stock", async (req, res)=>{
    try {
        const stock = new StockModel(req.body)
        console.log(req.body);
        await stock.save();
        res.redirect("/stocklist");
    } catch (error) {
        console.error(error);
        res.redirect("/stock");
    }
});
// getting stock from the database
router.get("/stocklist", async (req, res)=>{
    try {
        let items = await StockModel.find().sort({ $natural: -1 })
        res.render("stocktable", { items }) 
    } catch (error) {
       res.status(400).send("Unable to get data from the database."); 
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