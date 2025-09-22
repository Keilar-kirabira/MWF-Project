const express = require("express");
const router = express.Router();

const StockModel = require("../models/stockModel")
router.get("/stock", (req, res)=>{
    res.render("stock");
});

router.post("/stock", async (req, res)=>{
    try {
        const stock = new StockModel(req.body)
        console.log(req.body);
        await stock.save();
        res.redirect("/dashboard");
    } catch (error) {
        console.error(error);
        res.redirect("/stock");
    }
});















module.exports = router;