const express = require('express');
//  import { express } from "express";
const app = express()
const PORT = process.env.PORT_ONE || 9090
const mongoose = require('mongoose');
const amqp = require('amqplib')
const Order = require('./orderModel')
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
var channel,connection;

mongoose.connect("mongodb://127.0.0.1:27017/order-service")
.then(() => {
    console.log('Order-service DB connected');
  })
  .catch((error) => {
    console.error('Error in connecting Order-service db:', error.message);
  });

  async function connect(){
    const amqpServer="amqp://localhost:5672";
    connection = await amqp.connect(amqpServer)
    channel = await connection.createChannel()
    await channel.assertQueue('ORDER')
  }

  function createOrder(products,userEmail){
    let total = 0;
    for(let i=0; i <products.length; i++) {
      total +=products[i].price
    }
    console.log('user--mail');
    console.log(userEmail);
    const newOrder = new Order({
      products,
      user:userEmail,
      total_price : total
    })
    newOrder.save()
    return newOrder
  }


  connect().then(()=>{
    channel.consume('ORDER', data=> {
      const {products,userMail} = JSON.parse(data.content)
      console.log('Consuming order queue');
const newOrder = createOrder(products,userMail)
channel.ack(data);
channel.sendToQueue("PRODUCT", Buffer.from(JSON.stringify({newOrder})))
    })
  })



app.listen(PORT,()=> {
    console.log(`Order-service at ${PORT}`);
})