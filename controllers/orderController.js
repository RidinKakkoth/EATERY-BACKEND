const Stripe=require('stripe')
const orderModel = require('../models/orderModel')
const userModel = require('../models/userModel')
require('dotenv').config();


const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)
const frontend_url="https://eatery-frontend.onrender.com"
//placing order

const placeOrder=async(req,res)=>{

    try {
       
        const{userId,items,amount,address}=req.body
        const newOrder=new orderModel({
            userId,
            items,
            amount,
            address
        })

        await newOrder.save()
        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        const line_items=items.map((item)=>({
            price_data:{
                currency:"inr",
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100
            },
            quantity:item.quantity
        }))

        line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount:2*100
            },
            quantity:1
        })

        const session=await stripe.checkout.sessions.create({
            line_items:line_items,
        mode:"payment",
        success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    })

    res.json({success:true,session_url:session.url})

    } catch (error) {
     console.error(error)
     res.json({success:false,message:"error"})   
    }
}

//use webhook is the perfect way
const verifyOrder=async(req,res)=>{
    const{orderId,success}=req.body
    
    try {
        if(success=="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true})
            res.json({success:true,message:"Paid"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false,message:"Not Paid"})
        }
    } catch (error) {
        console.error(error)
        res.json({success:false,message:"error"})   
        
    }
}

const userOrders=async(req,res)=>{
    try {
        const{userId}=req.body
        const orders=await orderModel.find({userId:userId})
        res.json({success:true,data:orders
        })
    } catch (error) {
        console.error(error)
        res.json({success:false,message:"error"})   
        
    }
}

//listing all orders in admin panel

const listOrders=async(req,res)=>{
    try {
        const orders=await orderModel.find({})
        res.json({success:true,data:orders})
    } catch (error) {
        console.error(error)
        res.json({success:false,message:"error"})   
        
    }
}

//update order status

const updateStatus=async(req,res)=>{
    try {
        const{orderId,status}=req.body
        const orders=await orderModel.findByIdAndUpdate(orderId,{status:status})
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.error(error)
        res.json({success:false,message:"error"})   
        
    }
}



module.exports={placeOrder,verifyOrder,userOrders,listOrders,updateStatus}
