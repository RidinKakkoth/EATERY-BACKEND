const express=require("express")
const{loginAdmin,registerAdmin} =require('../controllers/adminController')

const adminRouter=express.Router()


adminRouter.post('/register',registerAdmin)
adminRouter.post('/login',loginAdmin)


module.exports=adminRouter