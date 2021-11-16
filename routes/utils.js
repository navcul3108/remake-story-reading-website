const multer = require("multer");
const fs = require("fs");
const uuid = require("uuid");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const folderDir = `./public/temporFiles/`;
		if (!fs.existsSync(folderDir))
			fs.mkdirSync(folderDir);
		cb(null, folderDir);
	},
	filename: (req, file, cb) => {
		const format = file.originalname.split(".").pop();
		cb(null, uuid.v1() + "." + format);
	}
})

const uploader = multer({ storage: storage });

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
        res.locals.avatarUrl = req.session.avatarUrl;
    }
    next();
}

module.exports = {isLoggedIn, authenticate, authenticateAJAX, writeLocalData, uploader}