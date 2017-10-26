var express = require('express');
var router = express.Router();

var firstLevel = require('../models/firstLevel');
var secondLevel = require('../models/secondLevel');
var thirdLevel = require('../models/thirdLevel');

router.post('/', function(req, res){
console.log(req.body);
    if(req.body.type == "l1"){

        var firstLevelData = new firstLevel({
          name:req.body.obj.level
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
        name:req.body.obj.level,
        firstLevel:req.body.obj.level1
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
        name:req.body.obj.level,
        firstLevel:req.body.obj.level1,
        secondLevel:req.body.obj.level2
      });
      thirdLevelData.save(function(err, data){
        if(data){
          res.send(data);
        }else{
          res.send(err);
        }
      });
    }

    if(req.body.getList){
      firstLevel.find(function(err, data){
        if(data){
          res.send(data);
        }
      })
    }

    if(req.body.updateList){
      if(req.body.type == "first"){
        firstLevel.({_id:req.body.id},{name:req.body.value},function(err, data){
          if(data){
            res.send(data);
          }
        });
      }if(req.body.type == "second"){
        firstLevel.({_id:req.body.id},{name:req.body.value},function(err, data){
          if(data){
            res.send(data);
          }
        });
      }if(req.body.type == "third"){
        firstLevel.({_id:req.body.id},{name:req.body.value},function(err, data){
          if(data){
            res.send(data);
          }
        });
      }
    }


    if(req.body.deleteList){
      firstLevel.remove({_id:req.body.id}, function(err, data){
        if(data){
          secondLevel.remove({firstLevel:req.body.id}, function(err, data2){
            if(data2){
              thirdLevel.remove({firstLevel:req.body.id}, function(err, data3){
                if(data3){
                  res.send("done");
                }
              })
            }
          })
        }
      })
    }

    if(req.body.findSecond){
      secondLevel.find({firstLevel:req.body.id},function(err, data){
        if(data){
          res.send(data);
        }
      })
    }if(req.body.findThird){
      thirdLevel.find({firstLevel:req.body.id},function(err, data){
        if(data){
          res.send(data);
        }
      })
    }if(req.body.findFirst){
      firstLevel.find({_id:req.body.id},function(err, data){
        if(data){
          res.send(data);
        }
      })
    }
    
});

module.exports = router;
