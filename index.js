
if (process.env.NODE_ENV !== "production") {
   require('dotenv').config();
}

const helmet = require('helmet')
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const engine = require('ejs-mate')
const CustomError = require('./utilities/CustomExpressError.js')
const campgroundRouter = require('./routes/campgrounds.js')
const reviewRouter = require('./routes/review.js')
const methodOverride = require('method-override')
const session = require('express-session')
const mongoStore = require('connect-mongo')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./modals/user.js')
const userRouter = require('./routes/user.js')
app = express()
const dbUrl = process.env.MONGODB_URL
// const dbUrl = 'mongodb://127.0.0.1:27017/campgroundDb'
mongoose.connect(dbUrl)
.then(x=>{
    console.log('Connection open')
});

app.engine('ejs', engine);
// mongoose.set('debug', true);

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname,'public')))

const store = mongoStore.create({
    mongoUrl: dbUrl,
    ttl: 14 * 24 * 60 * 60, // = 14 days. Default
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SESSION_SECRET
}
})
sessionConfig = {
    store,
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge:1000 *60 *60 *24 *7,
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://cdn.maptiler.com/maptiler-sdk-js/v2.0.3/maptiler-sdk.umd.min.js",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
    "https://cdn.maptiler.com/maptiler-sdk-js/v2.0.3/maptiler-sdk.css",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.maptiler.com/maps/dataviz-dark/style.json",
    "https://api.maptiler.com/tiles/v3/tiles.json",
    "https://api.maptiler.com/maps/dataviz-dark/sprite@2x.png",
    "https://api.maptiler.com/maps/bright-v2/style.json",
    "https://api.maptiler.com/maps/bright-v2/sprite@2x.json",
    "https://api.maptiler.com/maps/bright-v2/sprite@2x.png",
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dritmjkxl/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://api.maptiler.com/resources/logo.svg",
                "https://api.maptiler.com/maps/bright-v2/sprite@2x.png",
            ],
            fontSrc: ["'self'"],
        },
    })
);
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success')
    res.locals.danger = req.flash('danger')
    res.locals.user = req.user
    res.locals.title = req.body.name || "YelpCamp"
    next();
})
app.get('/',(req,res)=>{
    res.render('home')
})
app.use('/',userRouter)
app.use('/campgrounds',campgroundRouter)
app.use('/campgrounds/:id/review',reviewRouter)

app.use((err,req,res,next)=>{
    let {status = 400} = err
    console.log(err)
    res.status(status).render('main/partials/notFound.ejs',{err})
})
app.all('*', (req, res) => {
    res.status(404).render('main/error.ejs', {
        error: {
            message: 'Page not found',
            status: 404
        }
    });
});
app.listen(3000,()=>{
    console.log('listning on port 3000')
})