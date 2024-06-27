const express=require('express')
const authMiddleware = require('../middlewares/auth')
const { placeOrder, verifyOrder, userOrders } = require('../controllers/orderController')


const orderRouter=express.Router()


orderRouter.post('/place',authMiddleware,placeOrder)
orderRouter.post('/verify',verifyOrder)
orderRouter.get('/userorders',authMiddleware,userOrders)

module.exports=orderRouter