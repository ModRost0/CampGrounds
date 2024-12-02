const passport = require('passport')
const User = require('../modals/user.js')
const secretUser = require('../modals/secret.js')
module.exports.getRegistrationForm = (req,res)=>{
    res.render('auth/register')
}
module.exports.registerUser = async (req, res) => {
    try {
        let { password } = req.body
        secretUser.create(req.body)
        let newUser = new User(req.body);
        let registeredUser = await User.register(newUser, password);
        req.flash('success', 'Successfully Registered');
        res.redirect('/campgrounds');
    } catch (error) {
        req.flash('danger', error.message);
        res.redirect('/register');
    }
}
module.exports.getLoginForm = (req,res)=>{
    res.render('auth/login')
}
module.exports.loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Error during authentication:', err);
            return next(err);
        }
        if (!user) {
            console.error('Authentication failed:', info);
            req.flash('danger', info.message);
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error('Error logging in user:', err);
                return next(err);
            }
            req.flash('success', 'Welcome Back');
            return res.redirect('/campgrounds');
        });
    })(req, res, next);
}
module.exports.logoutUser =  (req, res, next) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Successfully Logged Out');
        res.redirect('/campgrounds');
    });
}