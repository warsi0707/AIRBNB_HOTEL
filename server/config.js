const MONGO_URL = process.env.MONGO_URL
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET
const USER_JWT_SECRET = process.env.USER_JWT_SECRET
const PORT = 3000



module.exports = {
    MONGO_URL,
    ADMIN_JWT_SECRET,
    USER_JWT_SECRET,
    PORT
}