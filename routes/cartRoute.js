const express=require('express')
const { addToCart, removeFromCart, getCart } = require('../controllers/cartController')
const authMiddleware = require('../middlewares/auth')



const cartRouter=express.Router()

cartRouter.post('/add',authMiddleware,addToCart)
cartRouter.patch('/remove',authMiddleware,removeFromCart)
cartRouter.get('/get-cart',authMiddleware,getCart)

module.exports=cartRouter