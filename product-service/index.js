const express = require("express");
//  import { express } from "express";
const app = express();
const PORT = process.env.PORT_ONE || 8080;
const mongoose = require("mongoose");
const Product = require('./productModel')


const amqp = require("amqplib");
const isAuthenticated = require("../isAuthenticated");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var order;
var channel, connection;

mongoose
  .connect("mongodb://127.0.0.1:27017/product-service")
  .then(() => {
    console.log("Product-service DB connected");
  })
  .catch((error) => {
    console.error("Error in connecting Product-service db:", error.message);
  });

async function connect() {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("PRODUCT");
}
connect();

app.post("/product/create", isAuthenticated, async (req, res) => {
  const { name, description, price } = req.body;
  const newProduct = new Product({
    name,
    description,
    price,
  });
  await newProduct.save();
  res.json(newProduct);
});

app.post("/product/buy",isAuthenticated,async(req,res)=> {
  const {ids} = req.body;
  console.log(req.user.email);
  const products = await Product.find({_id : {$in :ids }}) 
  channel.sendToQueue(
    "ORDER",
    Buffer.from(
      JSON.stringify({
        products,
        userMail : req.user.email,
      })
    )
  )

  channel.consume("PRODUCT",data=> {
    console.log('Consuming Product queue');
     order = JSON.parse(data.content)
     channel.ack(data)
  })
  return res.json(order)
})


app.listen(PORT, () => {
  console.log(`Product-service at ${PORT}`);
});
