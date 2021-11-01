const express = require('express');
const router = express.Router();
const userQuery = require("../db_access/accountQuery.js");
const {isLoggedIn} = require("./utils")

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

	const [isValid, isAdmin, lastName] = await userQuery.authenticateAccount(email, password);
	if (isValid) {
		req.session.email = email;
		req.session.isAdmin = isAdmin;
		req.session.lastName = lastName;
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

module.exports = router;
