const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const path = require("path");

const UserModel = require("../models/userModel");

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});

function fileFilter(req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

//getting a signup form
router.get("/registeruser", (req, res) => {
  res.render("registeruser");
});

router.post("/registeruser", upload.single("profileImage"), async (req, res) => {
  try {
    const user = new UserModel({
      userName: req.body.userName,
      email: req.body.email,
      birthDate: req.body.birthDate,
      gender: req.body.gender,
      nin: req.body.nin,
      phoneNumber: req.body.phoneNumber,
      role: req.body.role,
      nextofKin: req.body.nextofKin,
      nokNumber: req.body.nokNumber,
      employeeId: req.body.employeeId,
      profileImage: req.file ? req.file.filename : "default.png"
    });
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
        res.render("userstable", { users , success_msg: req.flash("success_msg"), error_msg: req.flash("error_msg")}); 
    } catch (error) {
      req.flash('error_msg','Users not found');
      res.redirect("/getusers") 
    }
});

//updating user route
router.get("/editusers/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

  res.render(`editregisteruser`, { user });
  } catch (error) {
     console.error(error.message);
    req.flash("error_msg", "Error loading user for edit.");
    res.redirect("/getusers");
  }
  
});
router.put("/editusers/:id",  async (req, res) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,                     //what has been changed, and thats the bodyform which was updated.
      { new: true }
    );
    if (!updatedUser) {
      req.flash("error_msg", "user not found.");
      return res.redirect("/getusers");
    }
     req.flash("success_msg", "User updated successfully!");
    res.redirect("/getusers");
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error updating user.");
    res.redirect("/getusers");

  }
});


//delete
router.post("/deleteusers",   async(req, res)=>{
  try {
       await UserModel.deleteOne({_id:req.body.id});
       req.flash("success_msg", "User deleted successfully!"); 
      res.redirect("/getusers")
  } catch (error) {
    console.log(error.message)
   req.flash("error_msg", "Unable to delete user.");
    res.redirect("/getusers");
  }
});





module.exports = router;
