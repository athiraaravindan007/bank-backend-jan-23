// import model
const { response } = require('express');
const users = require('../models/userSchema')

// import jsonwebtoken
const jwt = require('jsonwebtoken')

// define and export logic to resolve different http client requests 
// register
exports.register = async (req,res)=>{
    // register logic
    console.log(req.body);
   
    // get data by front end
    const {username,acno,password} = req.body
    if(!username || !acno || !password){
        res.status(403).json("All inputs are required!!!")
    }
    // check user is exist user
    try{
        const preuser =  await users.findOne({acno})
        if(preuser){
            // 406 --> not acceptable
            res.status(406).json("user already exist !!!")
        }
        else{
            // add user to db
            const newuser = new users({
                username,
                password,
                acno,
                balance:5000,
                transaction:[]
            })
            // to save newuser in mongodb
            await newuser.save()
                res.status(200).json(newuser)
        }
    }
    catch(error){
        res.status(401).json(error)
    }
}

// login
exports.login = async(req,res)=>{
    // get req  body
    // destructuring
    const {acno,password} = req.body
  
    try{
     // check acno and password is in db
       const preuser = await  users.findOne({acno,password})
    //check preuser or not
    if(preuser){
        // generate token using jwt
        const token = jwt.sign({
           loginAcno:acno 
        },"supersecertkey12345")
        // send to client
        res.status(200).json({preuser,token})
    }
    else{
        res.status(404).json("Invalid Account Number or Password")
    }

    }
    catch(error){
        res.status(401).json(error)

    }

}

// getBalance
exports.getBalance = async (req,res)=>{
    // get acno from path parameter
  let acno = req.params.acno
//   get data of given acno 
try{
    // find acno from users collection
  const preuser  = await users.findOne({acno})
  if(preuser){
    res.status(200).json(preuser.balance)

  }
  else{
    res.status(404).json('Invalid Account Numbrer !!!')
  }

}
catch(error){
    res.status(401).json(error)
}
}

// fund transfer
exports.transfer = async(req,res)=>{
    console.log("Inside transfer logic");
    // logic
    //1. get body from req, creditAcno,amt,pswd (destructuring)
    const {creditAcno,creditAmount,pswd} = req.body
    // convert creditAmount to number (now its a string so we should convert it)
    let amt = Number(creditAmount)
    const {debitAcno} = req
    console.log(debitAcno);
   try{
     // 2. check debitAcno and pswd is available in mongo db
     const debitUser = await users.findOne({acno:debitAcno,password:pswd})
     console.log(debitUser);

    //  3. creditAcno details from mongo db
    const creditUserDetails = await users.findOne({acno:creditAcno})
    console.log(creditUserDetails);

    // self transaction not allowed condition
    if(debitAcno!=creditAcno){
        if(debitUser && creditUserDetails){
            // perform transfer
            // check suffeciant balance available for debitUser 
            if(debitUser.balance>=creditAmount){
                // perform transfer
                // debit creditAmount from debitUser
                debitUser.balance-=amt
                // store transaction inside transactions in userSchema ie,
                // add debit transaction to debitUser
                debitUser.transactions.push({
                    transaction_type:"DEBIT",amount:creditAmount,fromAcno:debitAcno,toAcno:creditAcno
                })
                // save debitUser in mongodb
               await debitUser.save()
                // credit creditAmount to creditUserDetails
                creditUserDetails.balance+=amt
                 // add credit transaction to debitUser
                 creditUserDetails.transactions.push({
                    transaction_type:"CREDIT",amount:creditAmount,fromAcno:debitAcno,toAcno:creditAcno
                })
                // save creditUserDetails in mongodb
               await creditUserDetails.save()
                // response send to frontend
                res.status(200).json(" Fund Transfer Successfully.....")
            }
            else{
                // insuffeciant balance
                res.status(406).json("Insufficient Balance")
            }
        }
        else{
            res.status(406).json("Invalid credit or debit details!!!")
        }

    }
    // self transaction else condition
    else{
        res.status(406).json("Operration Denied!!! Self Transaction are not Allowed...")

    }


  
   }
   catch(err){
    res.status(401).json(error)
   }
    // res.send("Transfer request recieved")


}

// mini statement (getTransactions)
exports.getTransactions = async(req,res)=>{
    // 1. get acno from req.debitAcno
    let acno = req.debitAcno

    try{
     // 2. check acno is in mongodb
     const preuser = await users.findOne({acno})
     res.status(200).json(preuser.transactions)
    }
    catch(error){
        res.status(401).json("Invalid account number")
    }

}

// delete my account
exports.deleteMyAcno = async (req,res)=>{
    // 1. get acno from req
    let acno = req.debitAcno
    // 2. remove acno from db
    try{
        const removeitem = await users.deleteOne({acno})
        res.status(200).json("Removed Successfully...")

    }
    catch(error){
        res.status(401).json(error)

    }
}


