import express from 'express'
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
const app = express();
import "dotenv/config"
import userRoute from './routes/user.routes.js';
import blogRoute from './routes/blog.routes.js'
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'cors'

const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URL

try {
    mongoose.connect(MONGO_URL)
    console.log("Database connected successfully")
} catch (error) {
    console.log(error)
}

   
 
//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://blog-app-kohl-omega-45.vercel.app"
    ],
    credentials: true
  })
);

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))

// Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY // Click 'View API Keys' above to copy your API secret
});




//Difing route
app.use("/api/users", userRoute)
app.use("/api/blogs", blogRoute)


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})