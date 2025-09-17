const express = require("express");
const router = express.Router();

router.get("/stock", (req, res)=>{
    res.render("stock");
});

router.post("/stock", (req, res)=>{

});















module.exports = router;