const express = require('express');
const app = express();
const path = require('path');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://127.0.0.1/myBlog').then(db=>{
    console.log('DB connected');
}).catch(error=>console.log(`err ${error}`));

app.use(express.static(path.join(__dirname, 'public')));

// set view engine
app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars({defaultLayout: 'home'}));

// body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// load routes
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
// use routes
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);

const port = 8888 || process.env.PORT;
app.listen(port, ()=>{
    console.log(`app listen port ${port}`);
});