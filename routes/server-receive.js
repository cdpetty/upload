//Modules and Mongoose Models
var util = require('../modules/utilities'),
    path = require('path'),
    storage = require('../models/storage'),
    users = require('../models/users');

//Route
module.exports = function(req, res){
  /* Retreive a file from the user, save the filename in the database, and save the file in the user's folder.
     Verifies user information from form data */
  
  console.log('Attempted upload from username:', req.body.username, 'and password', req.body.password);
  
  //Check for required username and password
  if (req.body.username && req.body.password){
    
    //check for file to be uploaded
    if (req.files.file){
      
      //find the user requesting to upload
      users.find({ username: req.body.username, password: req.body.password }, function(err, found){
        if (err) res.send(err);
        else{
          
          //Ensure the user exists
          if (found){
            
            //Create new submission data
            var new_file = new storage();
            new_file.filename = req.files.file.name;
            new_file.date = new Date();
            new_file.user = found._id;
            
            //Save the new submission data
            new_file.save(function(err){
              if (err) res.send(err);
              else{
                
                //Save and store the file
                var resolved_path = path.resolve('storage', req.body.username);
                util.save(req.files.file, resolved_path, req.files.file.name, function(err){
                  if (err) res.send(err);
                  else res.send('File saved');
                });
              }
            });
          }
        }
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
