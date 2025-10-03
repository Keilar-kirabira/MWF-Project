const express = require("express");
const router = express.Router();
const passport = require("passport");

const UserModel = require("../models/userModel");
//getting a signup form
router.get("/registeruser", (req, res) => {
  res.render("registeruser");
});

router.post("/registeruser", async (req, res) => {
  try {
    const user = new UserModel(req.body);
    console.log(req.body);
    let existingUser = await UserModel.findOne({email:req.body.email});
    if(existingUser){
      return res.status(400).send("Already registered email.")
    }else{
       await UserModel.register(user, req.body.password,(error)=>{
        if(error){
           throw error; 
        }
        res.redirect("/getusers");
       })  
    }
  } catch (error) {
    res.status(400).send("Try again.")
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", passport.authenticate("local" ,{failureRedirect:"/login"}), (req, res) => {
req.session.user = req.user;                 //user who has logged in is referred to as req.user 
if(req.user.role === "Manager"){
 res.redirect("/dashboard")                  //redirect manage to dashboard
}else if(req.user.role === "Sales Agent"){
  res.redirect("/attendant-dashboard")           //redirect to attendant-dashboard
}else (res.render("noneuser"))  
});

//the logout route
router.get("/logout", (req, res) => {
 if(req.session){
  req.session.destroy((error) =>{
    if (error) {
      return res.status(500).send("Error loggingout")
    }
    res.redirect("/login")          //redirect to the index page.
  })
 } 
});

// getting users from the database
router.get("/getusers", async (req, res)=>{
    try {
        let users = await UserModel.find().sort({ $natural: -1 })
        res.render("userstable", { users }); 
    } catch (error) {
       res.status(400).send("Users not found."); 
    }
});

module.exports = router;
