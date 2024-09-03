const express = require('express')
const mongoose = require('mongoose')
const Campground = require('./modals/campground.js')
const path = require('path')
const methodOverride = require('method-override')
const engine = require('ejs-mate')
app = express()
mongoose.connect('mongodb://127.0.0.1:27017/campgroundDb')
.then(x=>{
    console.log('Connection open')
});

app.engine('ejs', engine);

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
let randNum = ()=>{
    return Math.floor(Math.random()*16)
}
app.get('/',(req,res)=>{
    res.redirect('/campgrounds')
})
app.get('/campgrounds',async(req,res)=>{
    let grounds = await Campground.find({})
    
    grounds.forEach(e => {
        if(e.image == "https://platform.polygon.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/13084031/DS3_Firelink_Shrine_0.0.0.1484831464.jpg?quality=90&strip=all&crop=7.8125%2C0%2C84.375%2C100&w=1200"){}else{
        e.image = `https://picsum.photos/200?random=${randNum()}`
        } })
    res.render('main/campgrounds',{grounds})
})
app.get('/campgrounds/create',(req, res)=>{
    res.render('main/create')
})
app.get('/campgrounds/:id',async(req,res)=>{
    let {id} = req.params
    let ground = await Campground.findById(id)
    res.render('main/details',{ground})
})


app.get('/campgrounds/:id/edit',async(req,res)=>{
    let {id} = req.params
    let ground = await Campground.findById(id)
    console.log(ground)
    res.render('main/edit',{ground})
})
app.post('/campgrounds',async(req,res)=>{
    await Campground.insertMany(req.body)
    res.redirect('/campgrounds')
})
app.delete('/campgrounds',async(req,res)=>{
    let {_id} = req.query
    console.log(_id)
    let ground = await Campground.findByIdAndDelete(_id)
    res.redirect('/campgrounds')
})
app.patch('/campgrounds/:id',async(req,res)=>{
    let {id} = req.params
    let change = req.body
    console.log(change)
    let ground = await Campground.findByIdAndUpdate(id,change)
    console.log(ground)
    res.redirect('/campgrounds')
})

app.listen(3000,()=>{
    console.log('listning on port 3000')
})