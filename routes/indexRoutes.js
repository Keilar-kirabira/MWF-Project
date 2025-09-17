const express = require("express");
const router = express.Router();



router.get("/", (req, res) => {
   res.render("index" );       //be careful and put here the same name you have named your file to avoid errors
});







module.exports = router;