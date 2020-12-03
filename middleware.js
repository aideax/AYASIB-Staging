module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/user/login')
    }
    next()
}

module.exports.isAdmin = (req, res, next) => {
    if(req.user.accountType === 'admin'){
        next()
    } else {
        return res.redirect('/lessons')
    }
}

