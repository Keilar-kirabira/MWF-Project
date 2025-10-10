const express = require("express");
const mongoose = require("mongoose"); // am importing mongoose to us objectid
const router = express.Router();
const StockModel = require("../models/stockModel");
const salesModel = require("../models/salesModel");
router.get("/dashboard",  async (req, res)=>{
    try {
        const sales = await salesModel.find().populate("salesAgent", "userName"); //populate method helps to expose details about the salesAgent forexample userName.and . find brings back everthing;
        const currentUser = req.session.user;
        res.render("dashboard", {sales, currentUser} );
    } catch (error) {
        
    }
   
});

router.post("/dashboard",  (req, res)=>{
   console.log(req.body);
});





router.get("/attendant-dashboard", async(req, res)=>{
    try {
      const items = await StockModel.find();        //this is for the stock table in the dashboard.
     
        // Get today's date in local time
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(),0,0,0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    const userId = req.session.user._id;  //logged in user

    // find sales from today
      const todaysSales = await salesModel.aggregate([
      {
        $match: {
          salesAgent: new mongoose.Types.ObjectId(userId) ,  
          paymentDate: { $gte: startOfDay, $lte: endOfDay }   //$gte-greaterthan or equal to
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" }
        }
      }
    ]);
    console.log("Today's Sales Aggregation:", todaysSales);

      // Extract number (default 0 if no sales today)
    const todaysSalesTotal = todaysSales.length > 0 ? todaysSales[0].totalSales : 0;
       // Get all sales of this agent (for the table)
    const agentSales = await salesModel.find({
      salesAgent: userId
    }).sort({ paymentDate: -1 });

      res.render("attendant-dashboard", {items,todaysSalesTotal,agentSales});  
    } catch (error) {
      console.error(error);
    res.status(500).send("Server error");  
    }
    
});

router.post("/attendant-dashboard", (req, res)=>{
   console.log(req.body);
});



module.exports = router;