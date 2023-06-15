// import mongoose
const mongoose = require('mongoose')

// using mongoose, define schema
const userScheme = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    acno:{
        type:Number,
        required:true,
        unique:true
    },
    balance:{
        type:Number,
        required:true,
    },
    transactions:{
        type:Array,
        required:true
    }
})
// create a model/ collection to store doccuments as given schema
const users = mongoose.model("users",userScheme)



// export model
module.exports = users

