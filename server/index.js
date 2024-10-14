require('dotenv').config()

const express = require("express")
const app = express()
const mongoose = require("mongoose")

const {userRouter} = require("./routes/User")
const { adminRoute } = require('./routes/Admin')
const { hotelRouter } = require('./routes/Hotels')
const cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(express.json())

app.use("/api/user", userRouter)
app.use("/api/admin",adminRoute)
app.use("/api", hotelRouter)



const main =async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database connected")
        app.listen(3000)
        console.log("App listing on port 3000")
    }catch(error){
        console.error("Error", error.message)
    }
}
main()