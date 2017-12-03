var express = require('express');
var router = express.Router();

var session = require('../models/session');
var multer  =   require('multer');

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './images');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname);
  }
});

var upload = multer({ storage : storage }).array('sessionPhoto',3);


router.post('/', function(req, res){
  console.log(req.body)
  if(req.body.createSession){
    session.find({session:req.body.session.name},function(err, data){
      if(data.length > 0 ){
        res.send("already")
      }else{

        var sessionData = new session({
          session: req.body.session.name,
          photos: req.body.photos,
          allLevel: req.body.allLevel,
          userId: req.body.userId
        });

        sessionData.save(function(err, data){
          if(data){
            res.send(data);
          }else{
            res.send("nothing");
          }
      });
      }
    });
  }else if(req.body.viewSession){
    console.log(req.body);
    session.find({userId:req.body.userId}, function(err, data){
        if(data && data.length > 0){
          res.send(data)
        }  else{
          res.send("404");
        }
    });
  }else if(req.body.deleteSession){
    console.log(req.body);
    session.remove({_id:req.body.id}, function(err, data){
        if(data){
          res.send(data)
        }  else{
          res.send("404");
        }
    });
  }else if(req.body.getSessionData){
    console.log(req.body, "dss");
    session.find({_id:req.body.sessionId},function(err, data){
        if(data && data.length > 0){
          console.log(data);
          res.send(data)
        }  else{
          res.send("404");
        }
    });
  }else if(req.body.checkSession){
    console.log(req.body);
    session.update({_id:req.body.sessionId},{status:"scan"},function(err, data){
        if(data){
          console.log(data);
          res.send(data);

        }  else{
          res.send("404");
        }
    });
  }else if(req.body.updateSession){
    console.log(req.body);
    session.update({_id:req.body.id},{$set:{session:req.body.value, allLevel:req.body.allLevel}},function(err, data){
        if(data){
          console.log(data);
          res.send(data);

        }  else{
          res.send("404");
        }
    });
  }else if(req.body.updateMedia){
    console.log(req.body);
    session.update({_id:req.body.id},{$set:{photos:req.body.media}},function(err, data){
        if(data){
          console.log(data);
          res.send(data);

        }  else{
          res.send("404");
        }
    });
  }else if(req.body.findSession){
    console.log(req.body, "dss");
    session.find({status:"scan"},function(err, data){
        if(data){
          res.send(data)
        }  else{
          res.send("404");
        }
    });
  }
});

module.exports = router;
