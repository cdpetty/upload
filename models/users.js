var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = Schema({
    username: String,
    password: String
});

var user = mongoose.model('user', userSchema);

module.exports = user;
