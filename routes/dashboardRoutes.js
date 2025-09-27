const express = require("express");
const router = express.Router();

router.get("/dashboard",(req, res)=>{
    res.render("dashboard");
});

router.post("/dashboard", (req, res)=>{
   console.log(req.body);
});





router.get("/attendant-dashboard",(req, res)=>{
    res.render("attendant-dashboard");
});

router.post("/attendant-dashboard", (req, res)=>{
   console.log(req.body);
});



module.exports = router;