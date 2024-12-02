const mongoose = require('mongoose')
const cities = require('./cities.js')
const titles = require('./seedHelpers.js')
const Campground = require('../modals/campground.js')
const axios = require('axios')
const dotenv = require('dotenv');
dotenv.config();
mongoose.connect(process.env.MONGODB_URL)
    .then(x => {
        console.log('Connection open')
    });
list = []
let header = {
    method: 'GET',
    headers: {
        "X-Api-Key": 'Jf+5XvkLQa0eGk38VQ093g==jDBI0rZj7A36OvG1',
        'Accept': 'image/jpg'
    }
}
let randNum = () => {
    return Math.floor(Math.random() * 20) + 1
}
let randCity = () => {
    let rand = Math.floor(Math.random() * 1000)
    let result = {randCity:`${cities[rand].city}, ${cities[rand].state}`,coords:[cities[rand].longitude,cities[rand].latitude]}
    return result;
}
let randTitle = () => {
    let randD = Math.floor(Math.random() * 16)
    let randP = Math.floor(Math.random() * 20)
    return `${titles.descriptors[randD]} ${titles.places[randP]}`
}
const randImg = async()=>{
    let data = await axios('https://api.api-ninjas.com/v1/randomimage',header)
 console.log(data)
 return data
}
let result;
const seed = async () => {

    for (let i = 0; i < 250; i++) {
        let data = await axios('https://api.api-ninjas.com/v1/quotes', header)
        result = randCity()
        list.push({
            name: randTitle()
            , location: result.randCity
            , description: `${data.data[0].quote}
        ${data.data[0].author}`
            , price: 99
            , image: [{
                url: 'https://res.cloudinary.com/dritmjkxl/image/upload/v1732466546/YelpCamp/slgzvvg9aljqkxdo6mwy.png',
                filename: 'YelpCamp/ldtwwafzkce9nifpuxp3'
            }, {
                url: 'https://res.cloudinary.com/dritmjkxl/image/upload/v1732466542/YelpCamp/nhmfpffuqbzktttfaouc.png',
                filename: 'YelpCamp/tzbhxeq8yu18jjckdwow'
            }]
            , reviews: []
            , author: '6730a1695eb1462a18461cc7'
            ,geometry:{
                type:'Point', 
                coordinates:result.coords
            }
                
        })
    }
    await Campground.insertMany(list)
    console.log('done')
}
seed()
console.log('done')
