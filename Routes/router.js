// import express
const express = require('express')
// import middleware
const middleware = require('../Middleware/routerSpecific')
// create routes,using express.router() class, object
const router = new express.Router()

// import controller
const userController = require('../controllers/userController')

// define routes to resolve request

// register request
router.post('/employee/register',userController.register)

// login request
router.post('/employee/login',userController.login)

// get balance
router.get('/user/balance/:acno',middleware.logMiddleware, userController.getBalance)

// fund transfer
router.post('/user/transfer/',middleware.logMiddleware,userController.transfer)

// mini statement
router.get('/user/ministatment',middleware.logMiddleware,userController.getTransactions)

// delete account
router.delete('/user/delete',middleware.logMiddleware,userController.deleteMyAcno)


// export router
module.exports = router

