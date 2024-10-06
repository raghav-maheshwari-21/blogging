const express=  require('express')
const multer = require('multer');
const mongoose = require('mongoose')
const path = require('path');
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const router = express.Router();

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,path.resolve('./public/uploads'))
    },
    filename : function(req,file,cb){
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null,filename);
    }
});

const upload = multer({storage:storage})

router.get('/add-new',(req,res)=>{
    return res.render('addBlog',{
        user : req.user
    });
})

router.get('/:id',async (req,res)=> {
    const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid blog ID");
  }

  try {
    const blog = await Blog.findById(id).populate('createdBy');
    const comments = await Comment.find({blogId:req.params.id}).populate('createdBy')
    if (!blog) {
      return res.status(404).send("Blog post not found");
    }
    console.log(blog);
    console.log(comments);
    return res.render('blog', {
      user: req.user,
      blog,
      comments
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while fetching the blog post");
  }
})

router.post('/comment/:blogId',async (req,res)=>{
    await Comment.create({
        content : req.body.content,
        blogId : req.params.blogId,
        createdBy : req.user._id
    })

    return res.redirect(`/blog/${req.params.blogId}`);
})

router.post('/',upload.single('coverImage'),async (req,res)=>{
    const {title,body} = req.body;
    const blog= await Blog.create({
        title,
        body,
        createdBy : req.user._id,
        coverImageURL : `/uploads/${req.file.filename}`
    });
    return res.redirect(`/`)
})

module.exports = router;
