var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  
});

var userModel = mongoose.model('user', userSchema);
module.exports = userModel
