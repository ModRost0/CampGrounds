const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const asyncWrapper = require('../utilities/asyncWraper.js')
const CustomError = require('../utilities/CustomExpressError.js')
const {userSchema} = require('../Schemas.js')
const passport = require('passport')
const User = require('../modals/user.js')
const userController = require('../controllers/userControllers.js')

router.route('/register')
.get(userController.getRegistrationForm)
.post(asyncWrapper(userController.registerUser));

router.route('/login')
.get(userController.getLoginForm)
.post(userController.loginUser);

router.post('/logout',userController.logoutUser);

module.exports = router;