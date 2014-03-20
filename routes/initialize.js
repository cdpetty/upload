var users = require('../models/users'),
    util = require('../modules/utilities'),
    path = require('path');

module.exports = function(req, res){
  //create the folder for the new user
  if (req.body.username && req.body.password){
    console.log('New user being created with username:', req.body.username, 'and password:', req.body.password);
    var new_user = new users();
    new_user.username = req.body.username;
    new_user.password = req.body.password;
    new_user.save(function(err){
      if (err) res.send(err);
      else{
        util.createDir(path.resolve('storage'), new_user.username, function(err){
          if (err) res.send(err);
          else res.end();
        });
      }
    });
  }
};