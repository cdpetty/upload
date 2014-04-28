//Modules and Mongoose Models
var users = require('../models/users'),
    storage = require('../models/storage');

//Route
module.exports = function(req, res){
  /* List the files that a user own */
  
  //Find the user
  users.findOne({ username: req.params.username }, function(err, user){
    if (err) res.send(err);
    else{
      
      //Retreive the user _id and query the storage database for the owned files
      var query = { user: user._id };
      if (req.query.path){
        var path = req.query.path.split('/');
        query.path = { $all: path };
        var path_length = path.length;
      }
      else
        var path_length = 0;
      
      storage.find(query, function(err, found){
        if (err) console.error(err);
        else{
          
          //Compile the list of files
          var files = [];
          var dirs = [];
          for(var x = 0; x < found.length; x++){
            if (found[x].path.length === path_length)
              files.push(found[x].filename);
            else if (dirs.indexOf(found[x].path[path_length]) === -1)
              dirs.push(found[x].path[path_length]);
          }
          var spacing = '  ';
          var list = '';
          if (files.length > 0){
            list = spacing + 'Files:\n';
            files.forEach(function(each){
              list += spacing + spacing + each + '\n';
            });
            list += '\n';
          }
          if (dirs.length > 0){
            list += spacing + 'Directories:\n';
            dirs.forEach(function(each){
              list += spacing + spacing + each + '\n';
            });
            list += '\n'
          }
          
          //send information
          res.send(list);
        }
      });
    }
  });
};