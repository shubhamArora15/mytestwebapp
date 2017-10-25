var mongoose = require('mongoose');

var secondLevelSchema = mongoose.Schema({
  name: {
    type:String
  },
  firstLevel: {
    type: String
  }
});

var secondLevelModel = mongoose.model('secondLevel', secondLevelSchema);
module.exports = secondLevelModel
