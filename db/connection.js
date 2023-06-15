// define node app  and mongodb database connectivity

// import mongoose in connection.js
const mongoose = require('mongoose')

// get connection string from .env file to connection.Js : process.env
const connectionString = process.env.DATABASE

// connect your node app with mongodb using connection string with the help of mongoose
mongoose.connect(connectionString,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>{
    console.log("Mongodb Atlas connected successfully... ");
}).catch((error)=>{
    console.log("Mongodb connection error: "+error);
})
