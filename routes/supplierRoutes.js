const express = require("express");
const router = express.Router();

const suppliersModel = require("../models/supplierModel")
router.get("/Addsupplier", (req, res)=>{
    res.render("suppliers");
});

router.post("/Addsupplier",async(req, res)=>{
    try {
        const supplier = new suppliersModel(req.body)
        console.log(req.body);
        await supplier.save();
        res.redirect("/supplierslist");
    } catch (error) {
        console.error(error);
        res.redirect("/Addsupplier");
    }
});

// getting suppliers from the database
router.get("/supplierslist", async (req, res)=>{
    try {
        let suppliers = await suppliersModel.find().sort({ $natural: -1 })
        res.render("supplierstable", { suppliers }) 
    } catch (error) {
       res.status(400).send("Unable to get data from the database."); 
    }
});


module.exports = router;