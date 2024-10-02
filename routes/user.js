const {Router} = require('express');
const User = require('../models/user');
const router = Router();


router.get('/signup', (req,res)=>{
    return res.render('signup');
})

router.get('/login',(req,res)=>{
    return res.render('login');
})

router.post('/signup',async (req,res)=>{
    const {fullName,email,password} = req.body;

    if(!fullName || !email || !password) throw new Error("Missing Field");

    await User.create({
        fullName,
        email,
        password
    })

    return res.redirect('/');
});


router.post('/login', async (req,res)=>{
    const {email,password} = req.body;

    const user = await User.matchPassword(email,password);
    console.log(user);
    return res.redirect('/');
})


module.exports = router;