const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose')

const userRouter = require('./routes/user');

const port = 8000;

mongoose.connect('mongodb://127.0.0.1:27017/blogify').then((e)=>{console.log("Connected to MongoDB!")});

app.use(express.urlencoded({extended:false}));

app.set('view engine','ejs');
app.set('views', path.resolve('./views'));

app.use('/user',userRouter);

app.get('/',(req,res)=>{
    res.render('home')
})

app.listen(port, ()=>{console.log(`Server running on port : ${port}`)});