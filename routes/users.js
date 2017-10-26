var express = require('express');
var router = express.Router();

var users = require('../models/users');

/* GET users listing. */
router.post('/', function(req, res, next) {
  if(req.body.login){
    users.find({email:req.body.loginData.email},function(err, data){
      if(data.length > 0){
          res.send("done");
      }else{
        res.send("fail")
      }
    })
  }

  if(req.body.signup){
    var userData = new users({
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        status: "pending"
    });
    users.find({email: req.body.email},function(err, data){
      if(data.length > 0){
          res.send("already");
      }
    })
  }
});

module.exports = router;
