const mongoose = require('mongoose')
const passport = require('passport')
const secretUserSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true
    },
    email:{
        type:String
    },
    password:{
        type:String
    }
})
const secretUser = mongoose.model('secretUser',secretUserSchema)
module.exports = secretUser;