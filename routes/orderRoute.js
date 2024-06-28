const express=require('express')
const authMiddleware = require('../middlewares/auth')
const { placeOrder, verifyOrder, userOrders, listOrders, updateStatus } = require('../controllers/orderController')


const orderRouter=express.Router()


orderRouter.post('/place',authMiddleware,placeOrder)
orderRouter.post('/verify',verifyOrder)
orderRouter.get('/userorders',authMiddleware,userOrders)
orderRouter.get('/listorders',listOrders)
orderRouter.post('/status',updateStatus)

module.exports=orderRouter