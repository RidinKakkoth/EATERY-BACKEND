const express=require('express')
const { googleLogin } = require('../controllers/userController')

const googleRouter=express.Router()


googleRouter.post('/google',googleLogin)

module.exports=googleRouter