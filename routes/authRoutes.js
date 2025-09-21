const express = require("express");
const router  = express.Router();

const UserModel = require("../models/userModel")
//getting a signup form
router.get("/signup",(req,res) => {
    res.render("signup");
});

router.post("/signup",(req,res) => {
    const user = new UserModel(req.body);
    console.log(req.body);
    user.save()
    res.redirect("/login");
});




router.get("/login",(req,res) => {
    res.render("login")
});

router.post("/login",(req,res) => {
    console.log(req.body);
    res.redirect("/stock");
});











module.exports = router;