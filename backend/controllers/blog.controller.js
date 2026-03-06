import mongoose, { trusted } from "mongoose";
import { Blog } from "../models/blog.model.js";
import { v2 as cloudinary } from 'cloudinary';

export const createBlog = async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Blog image is required"
            })
        }
        const { blogImage } = req.files;
        const allowedFormate = ["image/jpeg", "image/png"]
        if (!allowedFormate.includes(blogImage.mimetype)) {
            return res.status(400).json({
                success: false,
                message: "Invalid photo formate. Only jpg and png are allowerd"
            })
        }

        const { title, category, about } = req.body;
        if (!title || !category || !about) {
            return res.status(400).json({
                success: false,
                message: "Title, category & about are required fields"
            })
        } 

        const adminName = req?.user?.name;
        const adminPhoto = req?.user?.photo?.url;
        const createdBy = req?.user?._id

        const cloudinaryResponse = await cloudinary.uploader.upload(
            blogImage.tempFilePath
        )
        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.log(cloudinaryResponse.error)
        }
        const blogData = await Blog.create({
             title,
             category, 
             about,
             adminName,
             adminPhoto,
             createdBy,
             blogImage: {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.url,
            } 
        })
        // const blog = await Blog.create(blogData);

        res.status(200).json({
            success: true,
            message: "Blog Created successfully", blogData
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const deleteBlog = async (req, res) => {
    const {id} = req.params;
    const blog = await Blog.findById(id)
    if(!blog){
        return res.status(400).json({
            success: false,
            message: "Blog not found"
        })
    }
    await blog.deleteOne()
    res.status(200).json({
        success: true,
        message: "Blog deleted successfully"
    })
}

export const getAllBlogs = async (req, res) => {
    const allBlogs = await Blog.find()
    res.status(200).json(allBlogs)
}

export const getSingleBlog = async (req, res) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            success: false,
            message: "Invalid blog id"
        })
    }
    const blog = await Blog.findById(id)
    if(!blog){
        return res.status(400).json({
            success: false,
            message: 'Blog not found'
        })
    }
    res.status(200).json(blog)
}

export const getMyBlogs = async (req, res) => {
    const createdBy = req.user._id;
    const myBlogs = await Blog.find({ createdBy })
    res.status(200).json(myBlogs)
}

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    const { title, category, about } = req.body;
    let imageData = blog.blogImage;

if (req.files?.blogImage) {
  const file = req.files.blogImage;

  if (blog.blogImage?.public_id) {
    await cloudinary.uploader.destroy(blog.blogImage.public_id);
  }

  const uploaded = await cloudinary.uploader.upload(file.tempFilePath);

  imageData = {
    public_id: uploaded.public_id,
    url: uploaded.secure_url
  };
}

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, category, about, blogImage: imageData },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};