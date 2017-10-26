var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');
var users = require("../models/users");


router.post('/', function(req, res, next){
  console.log(req.body);
    var rand, host, link, mailOptions;

    var smtpTransport = nodemailer.createTransport("SMTP",
    {
        service: "Gmail",
            auth:
            {
            XOAuth2:
                {
                  user: "no_reply@livechek.com", // Your gmail address.
                                                        // Not @developer.gserviceaccount.com
                  clientId: "418419214912-cl08oopqas4p0a2selbv5vvaoqfkvr5s.apps.googleusercontent.com",
                  clientSecret: "XcUl7BEKka3xGs3WeEQMkUxr",
                  refreshToken: "1/OFp2lt3Ffs0AHpHwIuzOmaM3Yisk-aa3GE10moiDg88"
                }
            }
    });

    host=req.get('host');
    link="http://"+req.get('host')+"/#"+"/verify";

     mailOptions={
         to : req.body.user.email,
         subject : "Please confirm your Email account",
         html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
     }

     smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
         console.log(error);
         res.end("error");
      }else{
         console.log("Message sent: " + response.message);
         res.end("data");
      }
  });



});

module.exports = router;
