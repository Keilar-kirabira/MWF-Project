//1.Dependencies
const express = require('express');
const path = require("path");



//import routes
const indexRoutes = require("./routes/indexRoutes");
const authRoutes = require("./routes/authRoutes");
const stockRoutes = require("./routes/stockRoutes");
//2.Instantiations
const app = express();
const port = 3000;

//3.Configurations
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//4.Middleware
app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({ extended: true })); // helps to pass data from forms

//5.Routes
// using imported routes
app.use("/",indexRoutes);
app.use("/",authRoutes);
app.use("/",stockRoutes);





//non existent route handler
app.use((req, res) => {
  res.status(404).send("Oops! Route not found.");
});
//6.Bootstrapping Server
//this should always be the last line in this file.
app.listen(port, () => console.log(`listening on port ${port}`));