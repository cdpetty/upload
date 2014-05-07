/*jslint node: true */
//Modules
var path = require('path'),
    storage = require('../models/storage'),
    db_util = require('../modules/db_util'),
    admZip = require('adm-zip'),
    zip = new admZip();

//Route
module.exports = function(req, res){
  //Check for requested user and filename data
  if (req.params.username && req.query.filename){
    db_util.doesUserExist(req.params.username, '', false, function(err, user){
      if (err) res.send(err);
      else if (user){
        if (req.query.directory){
          var folder_path = req.query.filename.split('/').filter(function(n){return n!=''});
          db_util.doesDirectoryExist(folder_path, user._id, function(err, exists){

          if (err) console.err(err);
          else if (exists) {
            storage.find({path : {$all : folder_path }}, function(err, found){
              if (err) console.err(err);
              else{
                found.forEach(function(one){
                  //console.log('REQ.PARAMS.USERNAME:', req.params.username, 'FOUND.FILENAME:', one.filename, found);
                  zip.addLocalFile(path.resolve(__dirname, '../storage', req.params.username, one.filename));
                });
                var path_to_zip = path.join('/tmp', folder_path[folder_path.length - 1]);
                zip.writeZip(path_to_zip);
                res.download(path_to_zip);
              }
            });
            //var path_to_folder = path.resolve('../storage/', req.params.username, req.query.filename);
            //var path_to_targz = path.resolve('../temp', req.params.username + '_' + req.query.filename + '.tar.gz');
            
            
          }
          else res.send('No folder of this exist');
          });

        }
        else{
          db_util.doesFileExist(req.query.filename, user._id, function(err, exists){
            if (err) res.send(err);
            else if (exists){
              //Download the file
              res.download(path.resolve('storage', req.params.username, req.query.filename))
            }
            else res.send('File does not exist');
          });
        }
      }
      else res.send('User does not exist');
    });

  }
};
