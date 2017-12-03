var express = require('express');
var router = express.Router();

var users = require('../models/users');

/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log(req.body);

  if(req.body.login){
    console.log(req.body);
    users.find({email:req.body.loginData.email, password:req.body.loginData.password},function(err, data){
      if(data.length > 0){
          res.send(data);
      }else{
        res.send("fail")
      }
    })
  }

  if(req.body.signup){
    var userData = new users({
        email: req.body.user.email,
        phone: req.body.user.phone,
        username: req.body.user.username,
        password: req.body.user.password,
        status: "pending",
        role:"client"
    });
    users.find({email: req.body.user.email},function(err, data){
      if(data.length > 0){
          res.send("already");
      }else{
        userData.save(function(err, data){
          res.send(data);
        })
      }
    })
  }

});

module.exports = router;
