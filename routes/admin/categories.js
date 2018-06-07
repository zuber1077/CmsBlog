const express = require('express');
const router = express.Router();
const Category = require("../../models/Category");


router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

// Get categories

router.get('/', (req, res) => {

    Category.find({}).then(Category=>{
        res.render('admin/categories/index', {Category: Category});      
    });

});

// Create categories

router.post('/create', (req, res) => {

    const newCategory = Category({
        name: req.body.name
    });

    newCategory.save().then(savedCategory=>{
        res.redirect('/admin/categories');
    });

});

// Get categories Edit Route

router.get('/edit/:id', (req,res)=>{
    Category.findOne({_id: req.params.id}).then(Category=>{
        res.render("admin/categories/edit", { Category: Category});
    });
});

// categories Edit Route

router.put('/edit/:id', (req,res)=>{
    Category.findOne({_id: req.params.id}).then(Category=>{

        Category.name = req.body.name;

        Category.save().then(updateCategory=>{
            res.redirect('/admin/categories');
        }).catch(error=>console.log(error));
    });
});



// Delete categories
router.delete('/:id', (req,res)=>{
    Category.remove({_id: req.params.id}).then(result=>{
        res.redirect('/admin/categories');
    });
});

module.exports = router;