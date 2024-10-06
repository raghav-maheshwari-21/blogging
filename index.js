const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');

const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const Blog = require('./models/blog');

const port = 8000;

mongoose.connect('mongodb://127.0.0.1:27017/blogify').then((e)=>{console.log("Connected to MongoDB!")});

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')))

app.set('view engine','ejs');
app.set('views', path.resolve('./views'));

app.use('/user',userRouter);
app.use('/blog',blogRouter);

app.get('/',async (req,res)=>{
    const allBlogs = await Blog.find({});
    res.render('home',{
        user : req.user,
        blogs : allBlogs
    })
})

app.listen(port, ()=>{console.log(`Server running on port : ${port}`)});