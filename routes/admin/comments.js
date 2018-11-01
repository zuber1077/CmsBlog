const express = require("express");
const router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {

    Comment.find({})
    // Comment.find({user: req.user.id})
    .populate('user')
    .then(comments=>{
        res.render('admin/comments', {comments: comments});
    }); 
});

router.post('/', (req, res) => {
    Post.findOne({_id: req.body.id}).then(post=>{
        const newComment = new Comment({
            name: req.body.name,
            user: req.user.id,
            body: req.body.body
        });

        post.comments.push(newComment);
        post.save().then(savePost=>{
            newComment.save().then(savedComment=>{
                req.flash('success_message', 'Your comment will reviewed in second');
                res.redirect('back');
            }).catch(error=>console.log(error));
        });
    }).catch(error=>console.log(error));
});

router.delete('/:id', (req,res)=>{
    Comment.remove({_id: req.params.id}).then(result=>{

        Post.findOneAndUpdate({comments: req.params.id}, {$pull: {comments: req.params.id}}, (err, data)=>{
            if(err) console.log(err);
            res.redirect('/admin/comments');
        });
    });
});

// layouts/admin.handlebars
router.post('/approve-comment', (req, res) => {
    Comment.findByIdAndUpdate(req.body.id, {$set: {approveComment: req.body.approveComment}}, (err, result) => {
        if (err) return err;
        res.send(result);
    })
})

module.exports = router;