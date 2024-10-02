const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const userRouter = require('./routes/user');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const port = 8000;

mongoose.connect('mongodb://127.0.0.1:27017/blogify').then((e)=>{console.log("Connected to MongoDB!")});

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));

app.set('view engine','ejs');
app.set('views', path.resolve('./views'));

app.use('/user',userRouter);

app.get('/',(req,res)=>{
    res.render('home',{
        user : req.user
    })
})

app.listen(port, ()=>{console.log(`Server running on port : ${port}`)});