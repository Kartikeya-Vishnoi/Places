const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');
const mongoose = require("mongoose");
const path = require('path');

const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const func = require("./util/Location");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads/images', express.static(path.join(__dirname,'uploads', 'images')));

app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE');
  next();
})

app.use("/api/places", placesRoutes);
app.use("/api/users", userRoutes);

//Routing for randomly entered url
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

//Middleware for handling errors
app.use((error, req, res, next) => {
  if(req.file){
    fs.unlink(req.file.path, err => {
      console.log(err)
    })
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occoured" });
});

mongoose
  .connect('mongodb+srv://kartikeyavishnoi29:C7YnoDwUSQAo3QFP@cluster0.4pscnos.mongodb.net/mern?retryWrites=true&w=majority')
  .then(() => {
    app.listen(5000);
  })
  .catch((error) => console.log(error)+"this");