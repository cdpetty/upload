//Modules and Mongoose Models
var users = require('../models/users'),
    storage = require('../models/storage');

//Route
module.exports = function(req, res){
  /* List the files that a user own */
  
  //Find the user
  users.findOne({ username: req.params.username }, function(err, user){
    console.log('Found user:', user);
    if (err) res.send(err);
    else{
      
      //Retreive the user _id and query the storage database for the owned files
      console.log('ID:', user._id);
      storage.find({ user: user._id }, function(err, found){
        console.log(found);
        if (err) res.send(err);
        else{
          
          //Compile the list of files
          var dirs = [];
          var files = [];
          found.forEach(function(f){
            if (f.dir)
              dirs.push(f.filename);
            else
              files.push(f.filename);
          });
          
          var list = '';
          if (files.length !== 0){
            list = '  Files:\n';
            files.forEach(function(one){
              list += '    ' + one + '\n';
            });
            list += '\n';
          }
          if (dirs.length !== 0){
            list += '  Directories:\n';
            dirs.forEach(function(one){
              list += '    ' + one.split('.')[0] + '\n'
            });
          }
          
          //send information
          res.send(list);
        }
      });
    }
  });
};