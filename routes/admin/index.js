const express = require('express');
const router = express.Router();
const faker = require('faker');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment')
const User = require('../../models/User')
const Category = require('../../models/Category')
const {userAuthenticated}  = require('../../helpers/authentication');


router.all('/*', (req, res, next)=>{ // anything after admin
    req.app.locals.layout = 'admin';
    next();
});


router.get('/', (req, res) => {

    const promises = [
        Post.count().exec(),
        Comment.count(),
        Category.count(),
        User.count()
    ]

    Promise.all(promises).then(([postCount, commentCount, categoryCount, userCount]) => {
        res.render('admin/index', {
            postCount, commentCount, userCount, categoryCount, promises
        });  
    });
});

router.post('/generate-fake-post', (req, res) => {

    for(let i = 0; i < req.body.amount; i++){
        let post = new Post();

        post.title = faker.name.title();
        post.status = 'public';
        post.allowComments = faker.random.boolean();
        post.body = faker.lorem.sentences();
        post.slug = faker.name.title();

        post.save(function(err) {
            if(err) throw err;
        });
    }

    res.redirect('/admin/posts');

    
});

module.exports = router;