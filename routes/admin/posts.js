const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const fs = require('fs');
const { isEmpty } = require('../../helpers/upload-helpers');
const Category = require('../../models/Category');

router.all('/*', (req, res, next) => { // anything after admin
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
        Post.find({})
        .populate('category')
        .then(posts=>{ 
            res.render('admin/posts', {posts: posts,});            
        });
});

router.get('/create', (req, res) => {

    Category.find({}).then(categories=>{
        res.render('admin/posts/create', {categories: categories});        
    });

});

router.post('/create', (req, res) => {


    // validation for empty submit

    let errors = [];

    if(!req.body.title){
        errors.push({message: 'Please Add Title'});
    }
    if(!req.body.body){
        errors.push({message: 'Please Add Description'});
    }

    if(errors.length > 0){
        res.render('admin/posts/create',{
            errors: errors
        });
    }else{

    

    let filename = '700.jpeg';

    if(!isEmpty(req.files)){
        // Upload File
        
        let file = req.files.file;
        filename = Date.now() + '-' + file.name;

        file.mv('./public/uploads/' + filename, (err) => {
            if (err) throw err;
        });

        //console.log('is not Empty');
    }
    let allowComments  = true;

    if(req.body.allowComments){
        allowComments = true;
    }else{
        allowComments = false;
    }
    
    const newPost = new Post({
        user: req.user.id,
        title: req.body.title,
        status: req.body.status,
        allowComments: allowComments,
        body: req.body.body,
        category: req.body.category,
        file: filename
    });

    newPost.save().then(savePost=>{

    // Flush message for success Post
    req.flash('success_message', `Post ${savePost.title} was created Successfully`)


        res.redirect('/admin/posts');        
    }).catch(error=>{
        console.log('can not save post');
    });

}

});


router.get('/edit/:id', (req,res)=>{
    Post.findOne({_id: req.params.id}).then(post => {

        Category.find({}).then(categories => {
            res.render('admin/posts/edit', {post: post, categories: categories });
        });

    });
});

router.put('/edit/:id', (req,res)=>{
    
    Post.findOne({_id: req.params.id}).then(post => {
        if(req.body.allowComments){
            allowComments = true;
        }else{
            allowComments = false;
        }

        post.user = req.user.id;
        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = allowComments;
        post.body = req.body.body;
        post.category = req.body.category;

        if(!isEmpty(req.files)){
        // Upload File
        
        let file = req.files.file;
        filename = Date.now() + '-' + file.name;
        post.file = filename; // update image file

        file.mv('./public/uploads/' + filename, (err) => {
            if (err) throw err;
        });
    }


        post.save().then(updatePost=>{

            // Flush message for success Update
            req.flash("success_message", `Post was Successfully Updated`);

            res.redirect("/admin/posts");
        }).catch(error=>console.log(error));
        
    });

});

router.delete('/:id', (req,res)=>{

    Post.findOne({_id: req.params.id})
    .populate('comments')
    .then(post=>{

        fs.unlink(uploadDir + post.file, (err) => {

            if (!post.comments.length < 1){
                post.comments.forEach(comment=>{
                    comment.remove();
                });
            }
            post.remove().then(postRemove=>{
                req.flash('success_message', 'Post was Successfully Deleted');
                res.redirect('/admin/posts');
            }).catch(error=>console.log(error));
        // Flush message for success Delete

         });
    }).catch(error=>console.log(error));
});


// my post get route
router.get('/my-posts', (req, res) => {
    Post.find({user: req.user.id}) // populate posts for specific Admin
        .populate('category')
        .then(posts => {
            res.render('admin/posts/my-posts', { posts: posts});
    });
})


module.exports = router;