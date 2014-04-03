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
          var founded = ''
          found.forEach(function(f){
            founded += f.filename + '\n'
          });
          
          //send information
          res.send(founded.substring(0, founded.length - 1));
        }
      });
    }
  });
};