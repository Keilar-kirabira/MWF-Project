const express = require("express");
const router = express.Router();

router.get("/Addsale",(req, res)=>{
    res.render("sales");
});

router.post("/Addsale", (req, res)=>{
   console.log(req.body);
});
















module.exports = router;