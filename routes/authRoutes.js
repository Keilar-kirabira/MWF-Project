const express = require("express");
const router = express.Router();

const UserModel = require("../models/userModel");
//getting a signup form
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
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
        res.redirect("/login");
       })  
    }
  } catch (error) {
    res.status(400).send("Try again.")
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  console.log(req.body);
  res.redirect("/stock");
});

module.exports = router;
