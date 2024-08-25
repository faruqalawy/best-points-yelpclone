const User = require('../models/user')

module.exports.registerForm = (req, res) => {
    if(req.user) {
        req.flash('error_message', 'You are already login')
        res.redirect('/places')
    }
    res.render('auth/register')
}

module.exports.register = async (req, res, next) => {
    try {
        const {username, email, password} = req.body
        const user = new User({username, email})
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, (error) => {
            if(error) {return next(error)}
            req.flash('success_message', 'You are already register and login')
            res.redirect('/places')
        })
    } catch (error) {
        req.flash('error_message', error.message)
        res.redirect('/register')
    }
}

module.exports.loginForm = (req, res) => {
    if(req.user) {
        req.flash('error_message', 'You are already login')
        res.redirect('/places')
    }
    res.render('auth/login')
}

module.exports.login = (req, res) => {
    req.flash('success_message', 'login successfully')
    res.redirect('places')
}

module.exports.logout = (req, res, next) => {
    req.logout(function(err) {
        if(err) {return next(err)}
        req.flash('success_message', "You're already logout")
        res.redirect('/login')
    })
}