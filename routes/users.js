const express = require('express');
const router = express.Router();
const userQuery = require("../db_access/accountQuery.js");
const {isLoggedIn, authenticate, uploader} = require("./utils")
const fs = require("fs")
const {resolve} = require("path")

/* GET users listing. */
router.get('/login', isLoggedIn, function (req, res) {
	if(req.params.needRedirect!=="0")
		res.render('users/login', {originUrl: req.headers.referer });
	else
		res.render('users/login');
});

router.post("/login", async (req, res) => {
	const { body } = req;
	const email = body.email;
	const password = body.password;
	const originalUrl = body.originUrl

	const [isValid, isAdmin, lastName, avatarUrl] = await userQuery.authenticateAccount(email, password);
	if (isValid) {
		req.session.email = email;
		req.session.isAdmin = isAdmin;
		req.session.lastName = lastName;
		req.session.avatarUrl = avatarUrl;
		if(originalUrl && !originalUrl.includes("/users/login"))
			res.redirect(originalUrl);
		else
			res.redirect("/story")
	}
	else {
		res.render("users/login", {type: "failure", message: "Tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại" });
	}
})

router.get("/signup", (req, res, next) => {
	if (req.session.email) {
		res.render("users/loggedin");
	}
	else
		next();
})

router.get("/signup", (req, res) => {
	res.render("users/signup");
})

router.post("/signup", async (req, res) => {
	const { body } = req;
	const email = body.email;
	const password = body.password;
	const firstName = body.firstName;
	const lastName = body.lastName;

	const isSuccess = await userQuery.createAccount(email, password, firstName, lastName);
	if (isSuccess)
		res.render("users/login", {type: "success", message: "Đăng ký thành công. Hãy đăng nhập!" });
	else
		res.render("users/signup", {type: "failure", message: "Email đã được sử dụng. Vui lòng sử dụng email khác" });
})

router.post("/logout", (req, res) => {
	if (req.session.email) {
		req.session.email = null;
		req.session.isAdmin = null;
		req.session.lastName = null;
	}
	res.redirect("/users/login?needRedirect=0");
})

router.use("/profile", authenticate)

router.get("/profile", async (req, res)=>{
	try{
		let profile = await userQuery.getAccountProfile(req.session.email);
		res.render("users/profile", {profile})	
	}
	catch(e){
		res.render("error", {message: e})
	}
})

router.post("/profile/update-info", async(req, res)=>{
	const {body} = req;
	let {firstName, lastName, birthday} = body;
	console.dir(body);
	const email = req.session.email;
	if(firstName==null || lastName==null || birthday==null)
		res.render("error", {message: "Thông tin không chính xác"});
	else
	{
		if(userQuery.updateProfile(email, firstName, lastName, new Date(birthday)))
			res.redirect("/users/profile")
		else
			res.render("error", {message: "Không thể cập nhật!"})
	}
})

router.post("/profile/upload-avatar", uploader.single("avatarImage"), async (req, res)=>{
	const avatarFile = req.file;
	const email = req.session.email;
	const oldPath = req.body.oldPath; 
	if(await userQuery.updateAvatar(email, "/images/avatar/"+avatarFile.filename)){
		if(oldPath!=="/images/avatar/default.png")
			fs.unlink(resolve("public/"+oldPath), (err)=>{
				if(err){
					console.error(err);
				}
				fs.renameSync(resolve(avatarFile.path), resolve("public/images/avatar/"+avatarFile.filename));
				req.session.avatarUrl = "/images/avatar/"+avatarFile.filename;
				res.redirect("/users/profile")
			})
	}
	else{
		res.render("error", {message: "Có lỗi xảy ra trong quá trình xử lý!"});
	}
})

module.exports = router;
