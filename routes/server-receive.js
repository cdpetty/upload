//Modules and Mongoose Models
var util = require('../modules/utilities'),
    path = require('path'),
    storage = require('../models/storage'),
    users = require('../models/users'),
    db_util = require('../modules/db_util');

var newUserFile = function(file, username, _id, callback){
  
  //Create new submission data
  var new_file = new storage();
  new_file.filename = file.name;
  new_file.date = new Date(); 
  new_file.user = _id;
  
  //Save and store the file
  var resolved_path = path.resolve('storage', username);
  util.save(file, resolved_path, file.name, function(err){
    if (err) callback(err);
    else{
      //Save the new submission data
      new_file.save(callback(err));
    }
  });  
};


//Route
module.exports = function(req, res){
  /* Retreive a file from the user, save the filename in the database, and save the file in the user's folder.
     Verifies user information from form data */
  
  console.log('Attempted upload from username:', req.params.username, 'and password', req.body.password);
  
  //Check for required username and password
  if (req.params.username && req.body.password){
    
    //check for file to be uploaded
    if (req.files.file){
      
      //Check if the user exists
      db_util.doesUserExist(req.params.username, req.body.password, true, function(err, user){
        if (err) res.send(err);
        else if (user){
          console.log(user);
          //Check if the file already exists
          db_util.doesFileExist(req.files.file.name, user._id, function(err, exists){
            
            //send correct response
            console.log('Exists:', exists);
            if (err) res.send(err);
            else if (exists) res.send('File already Exists');
            else newUserFile(req.files.file, req.params.username, user._id, function(err){
              if (err) res.send(err);
              else res.send('Successful upload');
            });
          });
        }
        else res.send('User does not exist');
      });
    }
    else{
      res.send('No file provided');
    }
  }
  else{
    res.send('Incorrect username or password');
  }
};


