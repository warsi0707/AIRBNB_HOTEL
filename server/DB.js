const mongoose = require("mongoose")
const Schema = mongoose.Schema()

const AdminSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    email : String,
    password: String,
})
const UserSchema = new mongoose.Schema({
    username : {type: String, unique: true, required: true},
    email : String,
    password: String,
    booked : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel"
    }]
})
const HotelSchema = new mongoose.Schema({
    name: {type: String, unique:true},
    details :String,
    city: String,
    price: Number,
    checkout: Boolean,
    review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref : "Review"
    }]
})
const HotelReview = new mongoose.Schema({
    rating : Number,
    comment : String,
    reviewdBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
})

const Admin = mongoose.model("Admin", AdminSchema)
const User = mongoose.model("User", UserSchema)
const Hotel = mongoose.model("Hotel", HotelSchema)
const Review = mongoose.model("Review", HotelReview)


module.exports = {
    Admin,
    User,
    Hotel,
    Review
}

