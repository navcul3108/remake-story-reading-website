const express = require('express');
const router = express.Router();
const userQuery = require("../db_access/accountQuery.js");

router.get("/login", (req, res, next)=>{
  if(req.session.user){
    res.render("users/loggedin");
  }
  else
    next();
})

/* GET users listing. */
router.get('/login', function(req, res) {
  res.render('users/login', {title:"Login page"});
});

router.post("/login", async (req, res)=>{
  const {body} = req;
  const email = body.email;
  const password = body.password;

  const [isValid, isAdmin, lastName] = await userQuery.authenticateAccount(email, password);
  if(isValid){
    req.session.user = email;
    req.session.isAdmin = isAdmin;
    req.session.lastName = lastName;
    res.redirect("/");
  }
  else{
    res.render("users/login", {title:"Login page", type:"failure", message:"Your email or password is incorrect!Try again"});
  }
})

router.get("/signup", (req, res, next)=>{
  if(req.session.user){
    res.render("users/loggedin");
  }
  else
    next();
})

router.get("/signup", (req, res)=>{
  res.render("users/signup", {title: "Sign up page"});
})

router.post("/signup", async (req, res)=>{
  const {body} = req;
  const email = body.email;
  const password = body.password;
  const firstName = body.firstName;
  const lastName = body.lastName;

  const isSuccess = await userQuery.createAccount(email, password, firstName, lastName);
  if(isSuccess)
    res.render("users/login", {title: "Login page", type:"success", message: "Register successfully!Log in to join with our."});
  else
    res.render("users/signup", {title:"Register page", type:"failure", message:"Email has been used, please try another email.Each email is used for only one account!"});
})

router.post("/logout", (req, res)=>{
  if(req.session.user){
    req.session.user = null;
    req.session.isAdmin = null;
    req.session.lastName = null;
  }
  res.redirect("/users/login");
})

module.exports = router;
