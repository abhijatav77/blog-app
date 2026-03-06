import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'

// Authentication
export const isAuthenticated = async(req, res, next) => {
    try {
        const token = req.cookies.jwt
        console.log("Middleware ",token)
        if(!token){
            return res.status(400).json({
                success: false,
                message: "User not authenticated"
            })
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decode.id)
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        req.user = user;
        console.log("Middleware User:", user);
        next()
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Authorization
export const isAdmin = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(400).json({
                success: false,
                message: `User with given role ${req.user.role} not allowed`
            })
        }
        next();
    }
}