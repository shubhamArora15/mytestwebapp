var express = require('express');
var router  = express.Router();

var fs 		= require('fs');

var multer  = require('multer');

var storage = multer.diskStorage({

		    destination: function (req, file, cb) {
		        cb(null, 'public/images')
		    },
		    filename: function (req, file, cb) {
					console.log(file)
		        cb(null, file.originalname)
		    }
		});

	var upload = multer({ storage: storage });


router.post('/', upload.single('file'), function(req, res) {
	res.send("file sent")
});

module.exports = router;
