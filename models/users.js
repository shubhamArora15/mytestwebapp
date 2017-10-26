var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type:String
  },
  status: {
    type:String
  }
});

var userModel = mongoose.model('user', userSchema);
module.exports = userModel
