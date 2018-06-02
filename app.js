const express = require('express');
const app = express();
const path = require('path');
const handlebars = require('express-handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars({defaultLayout: 'home'}));

app.get('/', (req,res)=>{
    res.render('home/index');
});
app.get('/about', (req,res)=>{
    res.render('home/about');
});

app.get('/login', (req,res)=>{
    res.render("authentication/login");
});

app.get('/register', (req,res)=>{
    res.render("authentication/register");
});

const port = 8888 || process.env.PORT;
app.listen(port, ()=>{
    console.log(`app listen port ${port}`);
});