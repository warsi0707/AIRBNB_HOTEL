const Router = require("express")
const hotelRouter = Router()
const { AdminMid } = require("../Middleware/AuthMid");
const { Hotel } = require("../DB");

hotelRouter.get("/",async(req, res) =>{
    try{
        const hotels = await Hotel.find({})
        if(!hotels){
            return res.json({
                message: "No hotels are listed"
            })
        }
        return res.json({
            message: "All hotels",
            hotels: hotels

        })

    }catch(error){
        res.json({
            message: error.message
        })
    }
    
})


module.exports = {
    hotelRouter
}