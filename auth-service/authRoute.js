const express = require('express')
const {registerUser,loginUser} = require('./authController')


const auth_route = express()

auth_route.post('/register',registerUser)
auth_route.post('/login',loginUser)



module.exports = auth_route;