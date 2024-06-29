const express=require('express')
const cors=require('cors')
const connectDB = require('./config/db')
const foodRouter = require('./routes/foodRoute')
const userRouter = require('./routes/userRoute')
const cartRouter = require('./routes/cartRoute')
const orderRouter = require('./routes/orderRoute')
const adminRouter = require('./routes/adminRoute')


require('dotenv').config()

//app config
const app=express()
const port=process.env.PORT||4000


//middleware

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

//db connection

connectDB()

//api endpoints

app.use('/api/food',foodRouter)
app.use("/images",express.static('uploads'))
app.use('/api/user',userRouter)
app.use('/api/admin',adminRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)

app.get('/',(req,res)=>{

    res.send("api working")
})


app.listen(port,()=>{
    console.log(`running on${port}`)})

