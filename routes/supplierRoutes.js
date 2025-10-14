const express = require("express");
const router = express.Router();
const {ensureauthenticated,ensureManager} = require("../middleware/auth");

const suppliersModel = require("../models/supplierModel")
router.get("/Addsupplier", ensureauthenticated, ensureManager, (req, res)=>{
    res.render("suppliers");
});

router.post("/Addsupplier", ensureauthenticated, ensureManager, async(req, res)=>{
    try {
        const supplier = new suppliersModel(req.body)
        console.log(req.body);
        await supplier.save();
        req.flash("success_msg", "Supplier added successfully!")
        res.redirect("/supplierslist");
    } catch (error) {
        console.error(error);
        req.flash("error_msg", "Error adding supplier. Please try again.")
        res.redirect("/Addsupplier");
    }
});

// getting suppliers from the database
router.get("/supplierslist",ensureauthenticated, ensureManager, async (req, res)=>{
    try {
        let suppliers = await suppliersModel.find().sort({ $natural: -1 })
        res.render("supplierstable", { suppliers }) 
    } catch (error) {
       res.status(400).send("Unable to get data from the database."); 
    }
});


//updating route
router.get("/editsuppliers/:id", ensureauthenticated, ensureManager, async (req, res) => {
  try {
    const supplier = await suppliersModel.findById(req.params.id);

  res.render(`editsuppliers`, { supplier });
  } catch (error) {
     console.error(error.message);
    req.flash("error_msg", "Error loading supplier for edit.");
    res.redirect("/supplierslist");
  }
  
});

router.put("/editsuppliers/:id", ensureauthenticated, ensureManager, async (req, res) => {
  try {
    const updatedSupplier = await suppliersModel.findByIdAndUpdate(
      req.params.id,
      req.body,                     //what has been changed, and thats the bodyform which was updated.
      { new: true }
    );
    if (!updatedSupplier) {
      req.flash("error_msg", "Sale not found.");
      return res.redirect("/supplierslist");
    }
     req.flash("success_msg", "Supplier updated successfully!");
    res.redirect("/supplierslist");
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error updating supplier.");
    res.redirect("/supplierslist");

  }
});

//delete
router.post("/deletesuppliers", ensureauthenticated, ensureManager,  async(req, res)=>{
  try {
       await suppliersModel.deleteOne({_id:req.body.id});
       req.flash("success_msg", "Supplier deleted successfully!"); 
      res.redirect("/supplierslist")
  } catch (error) {
    console.log(error.message)
   req.flash("error_msg", "Unable to delete supplier.");
    res.redirect("/supplierslist");
  }
});


module.exports = router;