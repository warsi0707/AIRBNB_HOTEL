const jwt = require("jsonwebtoken")
const {ADMIN_JWT_SECRET} = require("../config")
const {USER_JWT_SECRET} = require("../config")


function AdminMid(req, res, next){
    const token = req.cookies.token
    try{
        if(!token){
            return res.json({message: "Not authenticated"})
        }
        const decoded = jwt.verify(token, ADMIN_JWT_SECRET)
        if(decoded){
            req.user = decoded
            next()
        }
    }catch(error){
        res.status(404).json({
            message: error.message
        })
    }
}
function UserMid(req, res, next){
    const token = req.cookies.token;
    try{
        if(!token){
            return res.json({
                message: "not authenitacted"
            })
        }
        const decoded = jwt.verify(token,USER_JWT_SECRET)
        if(decoded){
            req.user = decoded
            next()
        }else{
            return res.json({
                message: "Not authenticated"
            })
        }

    }catch(error){
        res.json({
            message: error.message
        })
       
    }
}

module.exports = {
    AdminMid,
    UserMid
}