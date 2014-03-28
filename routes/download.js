/*jslint node: true */
//Modules
var path = require('path'),
    storage = require('../models/storage'),
    db_util = require('../modules/db_util');

//Route
module.exports = function(req, res){
  //Check for requested user and filename data
  if (req.params.username && req.params.filename){
    db_util.doesUserExist(req.params.username, '', false, function(err, user){
      if (err) res.send(err);
      else if (user){
        db_util.doesFileExist(req.params.filename, user._id, function(err, exists){
          if (err) res.send(err);
          else if (exists){
            //Download the file
            res.download(path.resolve('storage', req.params.username, req.params.filename))
          }
          else res.send('File does not exist');
        });
      }
      else res.send('User does not exist');
    });

  }
};
