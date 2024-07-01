const express=require('express')
const authMiddleware = require('../middlewares/auth')
const { placeOrder, verifyOrder, userOrders, listOrders, updateStatus,topSelling } = require('../controllers/orderController')


const orderRouter=express.Router()


orderRouter.post('/place',authMiddleware,placeOrder)
orderRouter.post('/verify',verifyOrder)
orderRouter.get('/userorders',authMiddleware,userOrders)
orderRouter.get('/listorders',listOrders)
orderRouter.get('/topselling',topSelling)
orderRouter.post('/status',updateStatus)

module.exports=orderRouter