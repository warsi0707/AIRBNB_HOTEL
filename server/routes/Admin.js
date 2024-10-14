const Router = require("express")
const adminRoute = Router()
const bcrypt = require('bcrypt');
const { Admin, Hotel } = require("../DB");
const jwt = require('jsonwebtoken');
const {ADMIN_JWT_SECRET} = require("../config");
const { AdminMid } = require("../Middleware/AuthMid");


//admin signup
adminRoute.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const admin = await Admin.findOne({ username, email })
        if (admin) {
            return res.json({
                message: "Admin already signed up, please login"
            })
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const newAdmin = await Admin.create({
            username,
            email,
            password: hashPassword
        })
        res.json({
            message: "Admin signup successfully",
            admin: newAdmin
        })
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
})
//admin signin
adminRoute.post("/signin",async(req, res) => {
    const {email, password} = req.body;
    try{
        const admin = await Admin.findOne({email:email})
        const comparedPassword = await bcrypt.compare(password, admin.password)
        if(admin){
            const token =jwt.sign({
                adminId: admin._id,
                email: admin.email,
                username: admin.username
            },ADMIN_JWT_SECRET)
            
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            })
            res.json({
                message: "Admin sign in",
                token : token
            })
            
        }else{res.json({
            message: "Admin not found please sign up"
        })}
       
    }catch(error){
        res.status(404).json({
            message: error.message
        })
    }

})
//create hotels
adminRoute.post("/add",AdminMid,async (req, res) => {
    const {name, details, city, price} = req.body;
    try{
        const findHotel = await Hotel.findOne({
            name: name,
        })
        if(findHotel){
            return res.json({
                message: "This hotel are available in the data base"
            })
        }
        const addHotel = await Hotel.create({
            name,
            details,
            city,
            price
        })
        return res.json({
            message: `${name}, Hotel added successfully`,
            hotel: addHotel
        })
    }catch(error){
        res.json({
            message: error.message
        })
    }

})
//edit hotels
adminRoute.put("/:id",AdminMid, async(req, res) => {
    const {id} = req.params;
    const {name, details, price} = req.body;
    try{
        const findHotel = await Hotel.findById(id)
        console.log(findHotel)
        if(!findHotel){
            return res.json({
                message: `${name}, hotel are not available to update`
            })
        }
        const updateHotel = await Hotel.findByIdAndUpdate({_id:id},{
            name:name,
            details:details,
            price:price
        })
        return res.json({
            message: `${name}, details updated `,
            details: updateHotel
        })

    }catch(error){
        res.json({
            message: error.message
        })
    }

})
//delete hotels
adminRoute.delete("/:id",AdminMid, async (req, res) => {
    const {id} = req.params;
    try{
        const findHotel = await Hotel.findById(id)
        if(!findHotel){
            return res.json({
                message: "Hotel note available to delete",
            })
        }
        const deleteHotel = await Hotel.findByIdAndDelete(id)
        return res.json({
            message: `${deleteHotel.name}, is deleted successfully`
        })
    }catch(error){
        res.json({
            message: error.message
        })
    }
})

//admin logout
adminRoute.post("/logout", (req, res) => {
    const token = req.token
    res.clearCookie("token", token)
    res.json({
        message : `logout successfully`
    })
})


module.exports = {
    adminRoute
}