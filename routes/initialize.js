//Modules and Mongoose Models
var users = require('../models/users'),
    util = require('../modules/utilities'),
    path = require('path');

//Route
module.exports = function(req, res){
  /* Create an entry for a new user in the storage users db.
     Create a new folder for the new user in the storage directory.
     New username and password submitted through form data */
  
  //Check for form data
  if (req.body.username && req.body.password){
    console.log('New user being created with username:', req.body.username, 'and password:', req.body.password);
    
    //Create new user in database
    var new_user = new users();
    new_user.username = req.body.username
      .password = req.body.password;
    
    //Save new user
    new_user.save(function(err){
      if (err) res.send(err);
      else{
        
        //Create new user directory
        util.createDir(path.resolve('storage'), new_user.username, function(err){
          if (err) res.send(err);
          else res.end();
        });
        
      }
    });
  }
};