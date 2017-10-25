var express = require('express');
var router = express.Router();

var firstLevel = require('../models/firstLevel');
var secondLevel = require('../models/secondLevel');
var thirdLevel = require('../models/thirdLevel');

router.post('/', function(req, res){
    if(req.body.type == "l1"){
        var firstLevelData = new firstLevel({
          name:req.body.level
        });
        firstLevelData.save(function(err, data){
          if(data){
            res.send(data);
          }else{
            res.send(err);
          }
        });
    }if(req.body.type == "l2"){
      var secondLevelData = new secondLevel({
        name:req.body.level,
        firstLevel:req.body.level1
      });
      secondLevelData.save(function(err, data){
        if(data){
          res.send(data);
        }else{
          res.send(err);
        }
      });
    }if(req.body.type == "l3"){
      var thirdLevelData = new thirdLevel({
        name:req.body.level,
        firstLevel:req.body.level1,
        secondLevel:req.body.level2
      });
      thirdLevelData.save(function(err, data){
        if(data){
          res.send(data);
        }else{
          res.send(err);
        }
      });
    }
});

module.exports = router;
