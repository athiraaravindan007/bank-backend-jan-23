// application specific middleware
 const appMiddleware = (req,res,next)=>{
    console.log(" Bank App - Application specific middleware");
    // for request processing after middleware
    next()
}

// export
module.exports={
    appMiddleware
}

