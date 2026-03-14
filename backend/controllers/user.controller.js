import { User } from "../models/user.model.js";
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const register = async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                success: false,
                message: "User photo is required"
            })
        }
        const { photo } = req.files;
        const allowedFormate = ["image/jpeg", "image/png"]
        if (!allowedFormate.includes(photo.mimetype)) {
            return res.status(400).json({
                success: false,
                message: "Invalid photo formate. Only jpg and png are allowerd"
            })
        }

        const { name, email, password, role, phone, education } = req.body;
        if (!name || !email || !password || !role || !phone || !education || !photo) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exist"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const cloudinaryResponse = await cloudinary.uploader.upload(
            photo.tempFilePath
        )
        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.log(cloudinaryResponse.error)
        }
        const newUser = new User({
            name, email, password: hashPassword, role, phone, education, photo: {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.url,
            }
        })
        await newUser.save();

        const token = await jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" })
        // user.token = token;
        // await user.save();
        res.cookie("jwt", token, {
            httpOnly: true,       //xss
            secure: true,
            sameSite: 'none'
        })

        
        res.status(200).json({
            success: true,
            message: "User regitered successfully", newUser
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const user = await User.findOne({ email }).select("+password")
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        const isCompare = await bcrypt.compare(password, user.password)
        if (!isCompare) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials" 
            })
        }
        if (user.role !== role) {
            return res.status(400).json({
                success: false,
                message: `Given role ${role} not found`
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' })
        // user.token = token;
        // await user.save();
        res.cookie("jwt", token, {
            httpOnly: true,       //xss
            secure: true,
            sameSite: 'none'
        })

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token: token
        })
        // console.log("Saved Token:", user.token);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", { httpOnly: true })
        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getMyProfile = async (req, res) => {
    const user = await req.user;
    res.status(200).json({
        success: true,
        user
    })
}

export const getAllAdmins = async (req, res) => {
    const admins = await User.find({ role: "admin" })
    res.status(200).json({
        success: true,
        admin: admins
    })
}