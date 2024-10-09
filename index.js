const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const engine = require('ejs-mate')
const CustomError = require('./utilities/CustomExpressError.js')
const campgroundRouter = require('./routes/campgrounds.js')
const reviewRouter = require('./routes/review.js')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
app = express()
mongoose.connect('mongodb://localhost:27017/campgroundDb')
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
sessionConfig = {
    secret:'AixenSosuke',
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge:1000 *60 *60 *24 *7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use((req,res,next)=>{
    res.locals.success = req.flash('success')
    res.locals.danger = req.flash('danger')
    next();
})
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