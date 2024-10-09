const mongoose = require('mongoose')
const cities = require('./cities.js')
const titles = require('./seedHelpers.js')
const Campground = require('../modals/campground.js')
const axios = require('axios')
mongoose.connect('mongodb://127.0.0.1:27017/campgroundDb')
.then(x=>{
    console.log('Connection open')
});
list = []
let header = {
    method: 'GET',
    headers:{
    "X-Api-Key":'Jf+5XvkLQa0eGk38VQ093g==jDBI0rZj7A36OvG1',
    'Accept': 'image/jpg'}
}
let randNum = ()=>{
    return Math.floor(Math.random()*20)+1
}
let randCity = ()=>{
    let rand = Math.floor(Math.random()*1000)
    return `${cities[rand].city}, ${cities[rand].state}`
}
let randTitle = ()=>{
    let randD = Math.floor(Math.random()*16)
    let randP = Math.floor(Math.random()*20)
    return `${titles.descriptors[randD]} ${titles.places[randP]}`
}
const randImg = async()=>{
 let data = await axios('https://api.api-ninjas.com/v1/randomimage',header)
 console.log(data)
 return data
}
const seed = async()=>{
    
    for (let i = 0; i < 20; i++) {
    let data = await axios('https://api.api-ninjas.com/v1/quotes',header)
    list.push({name:randTitle()
        ,location:randCity()
        ,description:`${data.data[0].quote}
        ${data.data[0].author}`
        ,price:99
        ,image:`https://picsum.photos/200/300?random=${randNum()}`
        ,reviews:[]
    })
    console.log(list)
    

}
await Campground.deleteMany({name:{$nin : ['FireLink Shrine']}})
await Campground.insertMany(list)
}
seed()