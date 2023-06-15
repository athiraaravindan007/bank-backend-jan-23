// import
// config() :  loads .env file contents into process .env 
require('dotenv').config()
// import express
const express = require('express')

// import router
const router = require('./Routes/router')

// import appmiddleeware
const middleware = require('./Middleware/appMiddleware')

// import cors
const cors = require('cors')
// create express server
const server = express()
// set up port number for server
const PORT = 3000 || process.env.PORT
// import db
require('./db/connection')



// use cors, json parser in server app
server.use(cors())
server.use(express.json())


// use appmidleware
server.use(middleware.appMiddleware)

// use router in server app after using json parser
server.use(router)

// to resolve http request using express server
server.get('/',(req,res)=>{
    res.send("Bank server started !!!")
})

// run the server app in a specified port
server.listen(PORT,()=>{
    console.log(`Bank server started at port number ${PORT}`);
})









