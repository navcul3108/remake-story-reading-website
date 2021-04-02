var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('user/login', {title:"Login page"});
});

router.get("/register", (req, res, next)=>{
  res.render("user/register", {title: "Register page"});
})

module.exports = router;
