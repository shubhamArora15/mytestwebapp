var mongoose = require('mongoose');

var firstLevelSchema = mongoose.Schema({
  name:{
    type:String
  }
});

var firstLevelModel = mongoose.model('firstLevel', firstLevelSchema);
module.exports = firstLevelModel
