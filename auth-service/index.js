 const express = require('express');
//  import { express } from "express";
const app = express()
const PORT = process.env.PORT_ONE || 7070
  const mongoose = require('mongoose');
const authRoute = require('./authRoute');
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


mongoose.connect("mongodb://127.0.0.1:27017/auth-service")
.then(() => {
    console.log('Auth-service DB connected');
  })
  .catch((error) => {
    console.error('Error in connecting Auth-service db:', error.message);
  });

app.use('/auth',authRoute)

app.listen(PORT,()=> {
    console.log(`Auth-service at ${PORT}`);
})