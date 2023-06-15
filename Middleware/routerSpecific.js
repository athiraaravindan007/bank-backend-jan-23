// router specific middleware
// import jsonwebtoken
const jwt = require('jsonwebtoken')

// define logic for checking user login or not
const logMiddleware = (req,res,next)=>{
    console.log("router specific middleware");
    // get token 
    const token = req.headers['access-token']
    console.log(token);
   try{
     // verify token
    //  destructuring
     const {loginAcno} = jwt.verify(token,"supersecertkey12345")
     console.log(loginAcno);
    //  pass loginAcno to req
    req.debitAcno = loginAcno
      // to process user request
    next()
   }
   catch{
    res.status(401).json("Please login !!!")
   }
   
}

// export
module.exports = {
    logMiddleware
}