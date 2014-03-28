//Modules and Mongoose Models
var users = require('../models/users'),
    util = require('../modules/utilities'),
    path = require('path');


var createNewUser = function(username, password, callback){
  //Search for pre-existing user
  users.findOne({ username: username }, function(err, found){
    console.log('Found:', found);
    //ensure user does not already exist
    if (found) callback('User already exists');
    else if (err) callback(err);
    else{
      
      //Create new user in database
      var new_user = new users();
      new_user.username = username
      new_user.password = password
      
      //Save new user
      new_user.save(function(err){
        if (err) callback(err);
        else{
          
          //Create new user directory
          util.createDir(path.resolve('storage'), username, callback);
        }
      });
    }
  }); 
};

//Route
module.exports = function(req, res){
  /* Create an entry for a new user in the storage users db.
     Create a new folder for the new user in the storage directory.
     New username and password submitted through form data */
  
  //Check for form data
  if (req.body.username && req.body.password){
    console.log('New user being created with username:', req.body.username, 'and password:', req.body.password);
    createNewUser(req.body.username, req.body.password, function(err){
      if (err) res.send(err)
      else res.send('User Sucessfully Created');
    });
  }
};