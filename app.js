const express = require('express');
const app = express();
const path = require('path');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flush = require('connect-flash');
const passport = require('passport');
const {mongoDbUri} = require('./config/db');


mongoose.connect(mongoDbUri).then(db=>{
    console.log('DB connected');
}).catch(error=>console.log(`err ${error}`));

app.use(express.static(path.join(__dirname, 'public')));

// set view engine // Register Function to use
const { select, generateTime } = require("./helpers/handlebars-helpers");

app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars({ defaultLayout: 'home', helpers: { select: select, generateTime: generateTime}}));

// upload Middleware
app.use(upload());

// body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Method override
app.use(methodOverride('_method'));


// session and flush

app.use(session({
    secret: 'thisiszuber1077',
    resave: true,
    saveUninitialized: true
}));

app.use(flush());

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Flush Local Variables Using Middleware

app.use((req, res, next)=>{
    res.locals.user = req.user || null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');

    next();
});


// load routes
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require("./routes/admin/categories");
// use routes
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);

const port = 8888 || process.env.PORT;
app.listen(port, ()=>{
    console.log(`app listen port ${port}`);
});