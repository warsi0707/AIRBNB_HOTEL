const Router = require("express");
const { User, Hotel, Review } = require("../DB");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userRouter = Router()
const { USER_JWT_SECRET } = require("../config");
const { UserMid } = require("../Middleware/AuthMid");


//user signup
userRouter.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const findUser = await User.findOne({ username, email })
        if (findUser) {
            return res.json({
                message: `${username}, already exist please login`
            })
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const addUser = await User.create({
            username, email, password: hashPassword
        })
        return res.json({
            message: `${username}, signup successfully`,
            user: addUser
        })

    } catch (error) {
        res.json({
            message: error.message
        })
    }

})

//user signin
userRouter.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email })
        const verification = user && user.password ? await bcrypt.compare(password, user.password) : false
        if (user && verification) {
            const token = await jwt.sign({
                userId: user._id,
                email: user.email,

            }, USER_JWT_SECRET)
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            })
            return res.json({
                message: ` signin successfully`
            })
        } else {
            return res.json({
                message: "User not found, please signup"
            })
        }
    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

//user logout
userRouter.post("/logout", UserMid, (req, res) => {
    res.clearCookie("token", token)
    res.json({
        message: "Log out"
    })

})

//user book hotel
userRouter.post("/checkin/:id", UserMid, async (req, res) => {
    const { id } = req.params;
    try {
        const { userId } = req.user

        const user = await User.findById(userId)
        if (!user) {
            return res.json({
                message: "User not found"
            })
        }
        const hotelcheckin = user.booked.push(id)
        await user.save()
        return res.json({
            message: "You have booked this hotel",
            booked: hotelcheckin
        })

    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
})
//user bookings
userRouter.get("/bookings", UserMid, async (req, res) => {
    try {
        const { userId } = req.user;
        const user = await User.findById(userId).populate("booked")
        return res.json({
            message: "Your bookings",
            bookings: user.booked
        })
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
})
//hotel add review by user
userRouter.post("/rate/:hotelId",UserMid,async (req, res) => {
    const {userId} = req.user;
    const {hotelId} = req.params;
    const {rating, comment} = req.body;
    try{
        const review = await Review.create({
            rating: rating,
            comment: comment,
            reviewdBy: userId
        })
        const hotel = await Hotel.findById(hotelId)
        const rating = hotel.review.push(review)
        await hotel.save()
        return res.json({
            message: "Review added"
        })
        
        
    }catch(error){
        res.status(404).json({
            message: error.message
        })
    }
    
  
    

})
userRouter.get("/ratings/:hotelId",UserMid,async(req, res)=>{
    const {hotelId} = req.params;
    const ratings = await Hotel.findById(hotelId).populate("review")
    console.log(ratings.review)
    return res.json({
        message: "rated",
        ratings: ratings.review
      
    })
})
//hotel delete review by user
// userRouter.delete("/ratings/:id",UserMid,async (req, res) => {
//     const {id} = req.params;
//     const rating  = await Hotel.findByIdAndDelete()
// })





module.exports = {
    userRouter
}