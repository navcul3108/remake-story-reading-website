// Middeware function to check user is loggedin
function isLoggedIn(req, res, next){
    if(req.session.email){
      res.render("users/loggedin");
    }
    else
      return next();
}

function authenticate(req, res, next){
    if(req.session.email){
        return next()
    }
    res.render("error", {mesage: "Bạn cần đăng nhập để sử dụng chức năng này!"})
}

function authenticateAJAX(req, res, next){
    if(req.session.email){
        return next()
    }
    res.status(403).json({message: "Bạn cần đăng nhập để sử dụng chức năng này!"})
}

function writeLocalData(req, res, next){
    if(req.session.email){
        res.locals.email=req.session.email;
        res.locals.lastName = req.session.lastName;
        res.locals.isAdmin = req.session.isAdmin;
    }
    next();
}

module.exports = {isLoggedIn, authenticate, authenticateAJAX, writeLocalData}