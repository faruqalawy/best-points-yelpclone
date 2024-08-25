module.exports = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error_message', "You're not login")
        return res.redirect('/login')
    }
    next()
}