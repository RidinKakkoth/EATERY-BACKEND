const express=require('express')
const cors=require('cors')
const connectDB = require('./config/db')
const foodRouter = require('./routes/foodRoute')
const userRouter = require('./routes/userRoute')

require('dotenv').config()

//app config
const app=express()
const port=4000


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

app.get('/',(req,res)=>{

    res.send("api working")
})


app.listen(port,()=>{
    console.log(`running on${port}`)})

