const express = require("express");
const mongoose = require("mongoose"); // am importing mongoose to us objectid
const router = express.Router();
const StockModel = require("../models/stockModel");
const StockrecordModel = require("../models/stockrecordModel");
const salesModel = require("../models/salesModel");
const UserModel = require("../models/userModel");
router.get("/dashboard", async (req, res) => {
  try {
    const sales = await salesModel.find().populate("salesAgent", "userName"); //populate method helps to expose details about the salesAgent forexample userName.and . find brings back everthing;
    const currentUser = req.session.user;

    //total raw materials
    const rawMaterialsAgg = await StockModel.aggregate([
      { $match: { productType: "Wood" } }, // raw materials
      { $group: { _id: null, totalQty: { $sum: "$quantity" } } },
    ]);
    const rawMaterialsTotal =
      rawMaterialsAgg.length > 0 ? rawMaterialsAgg[0].totalQty : 0;

    //total finished products
    const finishedProductsAgg = await StockModel.aggregate([
      { $match: { productType: "Furniture" } },
      { $group: { _id: null, totalQty: { $sum: "$quantity" } } },
    ]);
    const finishedProductsTotal =
      finishedProductsAgg.length > 0 ? finishedProductsAgg[0].totalQty : 0;

    //low stock items
    // Low stock furniture (quantity <= 50)
    const lowStockFurnitureAgg = await StockModel.aggregate([
      { $match: { productType: "Furniture", quantity: { $lte: 50 } } },
      {
        $group: {
          _id: null,
          totalQty: { $sum: "$quantity" },
          count: { $sum: 1 },
        },
      },
    ]);
    const lowStockFurniture =
      lowStockFurnitureAgg.length > 0
        ? lowStockFurnitureAgg[0]
        : { totalQty: 0, count: 0 };
    const lowStockFurnitureItems = await StockModel.find({ productType: "Furniture", quantity: { $lte: 50 } })
      .select("productName quantity");    

    // Low stock raw materials (Wood) (quantity <= 50)
    const lowStockWoodAgg = await StockModel.aggregate([
      { $match: { productType: "Wood", quantity: { $lte: 50 } } },
      {
        $group: {
          _id: null,
          totalQty: { $sum: "$quantity" },
          count: { $sum: 1 },
        },
      },
    ]);
    const lowStockWood =
      lowStockWoodAgg.length > 0
        ? lowStockWoodAgg[0]
        : { totalQty: 0, count: 0 };
    const lowStockWoodItems = await StockModel.find({ productType: "Wood", quantity: { $lte: 50 } })
      .select("productName quantity");  
      
     // Create tooltip strings
    const lowStockFurnitureTooltip = lowStockFurnitureItems.map(i => `${i.productName}: ${i.quantity}`).join("\n");
    const lowStockWoodTooltip = lowStockWoodItems.map(i => `${i.productName}: ${i.quantity}`).join("\n");
  
    //Today's New Stock Entries
// const today = new Date();

// // Force UTC start and end of today
// const startOfDay = new Date(Date.UTC(
//   today.getUTCFullYear(),
//   today.getUTCMonth(),
//   today.getUTCDate(),
//   0, 0, 0
// ));

// const endOfDay = new Date(Date.UTC(
//   today.getUTCFullYear(),
//   today.getUTCMonth(),
//   today.getUTCDate(),
//   23, 59, 59, 999
// ));

// const todaysNewStockTotal = await StockModel.countDocuments({
//   dateBought: { $gte: startOfDay, $lte: endOfDay }
// });

    
//logic for total stock expenses
// Get first and last day of current month in UTC
const now = new Date();
const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));

// Aggregate monthly stock expenses
const monthlyStockAgg = await StockrecordModel.aggregate([
  {
    $match: {
      dateBought: { $gte: startOfMonth, $lte: endOfMonth }
    }
  },
  {
    $group: {
      _id: null,
      totalExpenses: { $sum: { $multiply: ["$costPrice", "$quantity"] } }
    }
  }
]);

const totalMonthlyStockExpenses = monthlyStockAgg.length > 0 ? monthlyStockAgg[0].totalExpenses : 0;


//aggregation for monthly sales revenue
//  we are using the first code up to get first and last day.
 const monthlySalesAgg = await salesModel.aggregate([
      { $match: { paymentDate: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);
    const totalMonthlyRevenue = monthlySalesAgg.length > 0 ? monthlySalesAgg[0].totalRevenue : 0;

// Top Sales Agent for the current month
// const topSalesAgentAgg = await salesModel.aggregate([
//   {
//     $match: {
//       paymentDate: { $gte: startOfMonth, $lte: endOfMonth }
//     }
//   },
//   {
//     $group: {
//       _id: "$salesAgent",            // group by sales agent
//       totalRevenue: { $sum: "$totalPrice" },
//       salesCount : {$sum: 1}
//     }
//   },
//   { $sort: { totalRevenue: -1 } },   // sort descending
//   { $limit: 1 }                       // take the top one
// ]);

// let topSalesAgent = null;
// if (topSalesAgentAgg.length > 0) {
//   const user = await UserModel.findById(topSalesAgentAgg[0]._id)
//     .select("userName");
//   topSalesAgent = {
//     userName: user ? user.userName : "Unknown",
//     totalRevenue: topSalesAgentAgg[0].totalRevenue,
//     salesCount: topSalesAgentAgg[0].salesCount
//   };
// }


    res.render("dashboard", {
      sales,
      currentUser,
      rawMaterialsTotal,
      finishedProductsTotal,
      lowStockFurniture,
      lowStockWood,
      lowStockFurnitureTooltip,
      lowStockWoodTooltip,
      // todaysNewStockTotal,
      totalMonthlyStockExpenses,
      totalMonthlyRevenue,
      // topSalesAgent
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error")
  }
});

router.post("/dashboard", (req, res) => {
  console.log(req.body);
});



// ATTENDANT DASH BOARD

router.get("/attendant-dashboard", async (req, res) => {
  try {
    const items = await StockModel.find(); //this is for the stock table in the dashboard.

    // Get today's date in local time
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999
    );
    const userId = req.session.user._id; //logged in user

    // find sales from today
    const todaysSales = await salesModel.aggregate([
      {
        $match: {
          salesAgent: new mongoose.Types.ObjectId(userId),
          paymentDate: { $gte: startOfDay, $lte: endOfDay }, //$gte-greaterthan or equal to
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    console.log("Today's Sales Aggregation:", todaysSales);

    // Extract number (default 0 if no sales today)
    const todaysSalesTotal =
      todaysSales.length > 0 ? todaysSales[0].totalSales : 0;

    //for the two other cards
    //total quantity of raw materials
    const woodAgg = await StockModel.aggregate([
      { $match: { productType: "Wood" } },
      { $group: { _id: null, totalQty: { $sum: "$quantity" } } },
    ]);
    const woodTotal = woodAgg.length > 0 ? woodAgg[0].totalQty : 0;

    //total quantity for furniture products
    const furnitureAgg = await StockModel.aggregate([
      { $match: { productType: "Furniture" } },
      { $group: { _id: null, totalQty: { $sum: "$quantity" } } },
    ]);
    const furnitureTotal =
      furnitureAgg.length > 0 ? furnitureAgg[0].totalQty : 0;

    // Get all sales of this agent (for the table)
    const agentSales = await salesModel
      .find({
        salesAgent: userId,
      })
      .sort({ paymentDate: -1 });

    res.render("attendant-dashboard", {
      items,
      todaysSalesTotal,
      woodTotal,
      furnitureTotal,
      agentSales,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.post("/attendant-dashboard", (req, res) => {
  console.log(req.body);
});

module.exports = router;
