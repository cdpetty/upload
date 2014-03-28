//Modules and Mongoose Models
var util = require('../modules/utilities'),
    path = require('path'),
    storage = require('../models/storage'),
    users = require('../models/users'),
    db_util = require('../modules/db_util');

var delUserFile = function(filename, username, _id, callback){
  
  //Save and store the file
  var resolved_path = path.resolve('storage', username);
  util.delete(resolved_path, filename, function(err){
    if (err) callback(err);
    else{
      //Save the new submission data
      storage.findOneAndRemove({ filename: filename, user: _id }, callback);
    }
  });  
};


//Route
module.exports = function(req, res){
  /* Retreive a file from the user, save the filename in the database, and save the file in the user's folder.
     Verifies user information from form data */
  
  console.log('Attempted upload from username:', req.body.username, 'and password', req.body.password);
  
  //Check for required username and password
  if (req.body.username && req.body.password && req.body.filename){
    
      
    //Check if the user exists
    db_util.doesUserExist(req.body.username, req.body.password, true, function(err, user){
      if (err) res.send(err);
      else if (user){
        //Check if the file already exists
        db_util.doesFileExist(req.body.filename, user._id, function(err, exists){
          
          //send correct response
          if (err) res.send(err);
          else if (!exists) res.send('File does not Exist');
          else delUserFile(req.body.filename, req.body.username, user._id, function(err){
            if (err) res.send(err);
            else res.send('Successful delete');
          });
          
        });
      }
      else res.send('User does not exist');
    });
  }
  else{
    res.send('Incorrect username or password');
  }
};


