const express = require('express');
const bcrypt = require("bcryptjs");
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');

router.all('/*', (req, res, next)=>{ 
    req.app.locals.layout = 'home';
    next();
});

router.get('/', (req,res)=>{

    // render All Post on Home
    Post.find({}).then(posts=>{

        Category.find({}).then(categories=>{
            res.render('home/index', {posts: posts, categories: categories});
        });

    });
});
router.get('/about', (req,res)=>{
    res.render('home/about');
});

router.get('/login', (req,res)=>{
    res.render("home/login");
});

router.get('/register', (req,res)=>{
    res.render("home/register");
});

router.post('/register', (req,res)=>{

    let errors = [];

    if(!req.body.firstName) {
        errors.push({message: 'please enter your first name'});
    }


    if(!req.body.lastName) {
        errors.push({message: 'please add a last name'});
    }

    if(!req.body.email) {
        errors.push({message: 'please add an email'});
    }

    if(!req.body.password) {
        errors.push({message: 'please enter a password'});
    }


    if(!req.body.passwordConfirm) {
        errors.push({message: 'This field cannot be blank'});
    }


    if(req.body.password !== req.body.passwordConfirm) {
        errors.push({message: "Password fields don't match"});
    }


    if(errors.length > 0){


        res.render('home/register', { // if err user back with data
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,

        })

    } else {

        User.findOne({email: req.body.email}).then(user=>{ //find user from db

            if(!user){ //checking if the email is exist

           

    const newUser = new User({ 
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });


    bcrypt.genSalt(10, (err,salt)=>{ //hash the password using bcrypt
        bcrypt.hash(newUser.password, salt, (err, hash)=>{
            newUser.password = hash;

            req.flash('success_message', 'You are now registered, Please Login');

            newUser.save().then(savedUser => {
                res.redirect('/register');
            });            
        });
    });

    } else { //if user end here 

        req.flash('error_message', 'account with the email already exist please login');

        res.redirect('/login');

    } 

}); // find user from db end here

    } //else err end here
});

router.get('/post/:id', (req,res)=>{
    Post.findOne({_id: req.params.id}).then(post =>{

        Category.find({}).then(categories=>{
            res.render("home/post", {post: post, categories: categories});
        });   
    });
    
});

module.exports = router;