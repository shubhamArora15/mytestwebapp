var mongoose = require('mongoose');

var thirdLevelSchema = mongoose.Schema({
  name: {
    type: String
  },
  firstLevel: {
    type: String
  },
  secondLevel: {
    type: String
  }
});

var thirdLevelModel = mongoose.model('thirdLevel', thirdLevelSchema);
module.exports = thirdLevelModel
