const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const StockModel = require("../models/stockModel");
const StockrecordModel = require("../models/stockrecordModel");
const salesModel = require("../models/salesModel");
const UserModel = require("../models/userModel");
const {ensureauthenticated,ensureManager} = require("../middleware/auth");

router.get("/dashboard",ensureauthenticated, ensureManager, async (req, res) => {
  try {
    const sales = await salesModel.find().populate("salesAgent", "userName");
    const currentUser = req.session.user;

    // Total raw materials
    const rawMaterialsAgg = await StockModel.aggregate([
      { $match: { productType: "Wood" } },
      { $group: { _id: null, totalQty: { $sum: "$quantity" } } },
    ]);
    const rawMaterialsTotal = rawMaterialsAgg.length > 0 ? rawMaterialsAgg[0].totalQty : 0;

    // Total finished products
    const finishedProductsAgg = await StockModel.aggregate([
      { $match: { productType: "Furniture" } },
      { $group: { _id: null, totalQty: { $sum: "$quantity" } } },
    ]);
    const finishedProductsTotal = finishedProductsAgg.length > 0 ? finishedProductsAgg[0].totalQty : 0;

    // Low stock items
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
    const lowStockFurniture = lowStockFurnitureAgg.length > 0 ? lowStockFurnitureAgg[0] : { totalQty: 0, count: 0 };
    
    const lowStockFurnitureItems = await StockModel.find({ 
      productType: "Furniture", 
      quantity: { $lte: 50 } 
    }).select("productName quantity");

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
    const lowStockWood = lowStockWoodAgg.length > 0 ? lowStockWoodAgg[0] : { totalQty: 0, count: 0 };
    
    const lowStockWoodItems = await StockModel.find({ 
      productType: "Wood", 
      quantity: { $lte: 50 } 
    }).select("productName quantity");

    // Create tooltip strings
    const lowStockFurnitureTooltip = lowStockFurnitureItems.map(i => `${i.productName}: ${i.quantity}`).join("\n");
    const lowStockWoodTooltip = lowStockWoodItems.map(i => `${i.productName}: ${i.quantity}`).join("\n");

    // Today's New Stock Entries - FIXED
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0, 0, 0
    );
    // Convert to UTC by subtracting the timezone offset
    const startOfDayUTC = new Date(startOfDay.getTime() - (startOfDay.getTimezoneOffset() * 60000));

    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23, 59, 59, 999
    );
     const endOfDayUTC = new Date(endOfDay.getTime() - (endOfDay.getTimezoneOffset() * 60000));
    // Check StockrecordModel for today's entries (this is where new stock is recorded)
    const todaysNewStockTotal = await StockrecordModel.countDocuments({
      dateBought: { 
        $gte: startOfDayUTC, 
        $lte: endOfDayUTC 
      }
    });

    // console.log("Today's date range:", startOfDayUTC, "to", endOfDayUTC);
    // console.log("Today's new stock entries found:", todaysNewStockTotal);

  
  

    // Monthly stock expenses
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

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

    // Monthly sales revenue
    const monthlySalesAgg = await salesModel.aggregate([
      { $match: { paymentDate: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);
    const totalMonthlyRevenue = monthlySalesAgg.length > 0 ? monthlySalesAgg[0].totalRevenue : 0;

    // Calculate profit margin for the template
    const profit = totalMonthlyRevenue - totalMonthlyStockExpenses;
    const profitMargin = totalMonthlyRevenue > 0 ? ((profit / totalMonthlyRevenue) * 100).toFixed(1) : 0;

    // Top Sales Agent
    const topSalesAgentAgg = await salesModel.aggregate([
      {
        $match: {
          paymentDate: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: "$salesAgent",
          totalRevenue: { $sum: "$totalPrice" },
          salesCount: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 1 }
    ]);

    let topSalesAgent = null;
    if (topSalesAgentAgg.length > 0 && topSalesAgentAgg[0]._id) {
      const user = await UserModel.findById(topSalesAgentAgg[0]._id).select("userName");
      topSalesAgent = {
        userName: user ? user.userName : "Unknown",
        totalRevenue: topSalesAgentAgg[0].totalRevenue,
        salesCount: topSalesAgentAgg[0].salesCount
      };
    }

    //  PIE CHART DATA for Sales Distribution between Wood and Furniture
    const salesDistribution = await salesModel.aggregate([
      {
        $group: {
          _id: "$productType",
          totalSales: { $sum: "$totalPrice" },
          salesCount: { $sum: 1 }
        }
      }
    ]);

    // console.log("Sales Distribution Result:", JSON.stringify(salesDistribution));

    // Extract wood and furniture sales
    let woodSales = 0;
    let furnitureSales = 0;
    let woodSalesCount = 0;
    let furnitureSalesCount = 0;

    salesDistribution.forEach(item => {
      if (item._id === "Wood") {
        woodSales = item.totalSales;
        woodSalesCount = item.salesCount;
      } else if (item._id === "Furniture") {
        furnitureSales = item.totalSales;
        furnitureSalesCount = item.salesCount;
      }
    });

    // Stock Distribution Data
    const stockDistribution = await StockModel.aggregate([
      {
        $group: {
          _id: "$productType",
          totalQuantity: { $sum: "$quantity" }
        }
      }
    ]);


    // Format chart data
    const chartData = {
      salesDistribution: {
        wood: woodSales,
        furniture: furnitureSales,
        woodCount: woodSalesCount,
        furnitureCount: furnitureSalesCount
      },
      stockDistribution: stockDistribution.map(item => ({
        type: item._id || 'Unknown',
        quantity: item.totalQuantity
      })),
    };

    res.render("dashboard", {
      sales,
      currentUser,
      rawMaterialsTotal,
      finishedProductsTotal,
      lowStockFurniture,
      lowStockWood,
      lowStockFurnitureTooltip,
      lowStockWoodTooltip,
      todaysNewStockTotal,
      totalMonthlyStockExpenses,
      totalMonthlyRevenue,
      topSalesAgent,
      chartData: JSON.stringify(chartData),
      // Also pass individual values for easy access
      woodSales,
      furnitureSales,
      woodSalesCount,
      furnitureSalesCount,
      // Pass profit margin to template
      profit,
      profitMargin
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).send("Server error: " + error.message);
  }
});


// ATTENDANT DASH BOARD

router.get("/attendant-dashboard", ensureauthenticated,  async (req, res) => {
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
