var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: {
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
  },
  role: {
    type:String
  }
});

var userModel = mongoose.model('user', userSchema);
module.exports = userModel
