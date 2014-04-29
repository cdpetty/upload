var storage = require('../models/storage'),
    users = require('../models/users');


module.exports.doesFileExist = function(filename, _id, callback){
  console.log('filename:', filename, 'id:', _id);
  storage.findOne({ filename: filename, user: _id }, function(err, found){
    console.log('Found2:', found);
    if (err) callback(err)
    else if (found) callback(null, true);
    else callback(null, false);
  });
};

module.exports.doesUserExist = function(username, password, useAuth, callback){
  if (useAuth)
    users.findOne({ username: username, password: password }, callback);
  else
    users.findOne({ username: username }, callback);
};

module.exports.doesDirectoryExist = function(folder_path, _id, callback){  
  console.log('THIS IS THE FOLDER PATH:', folder_path);
  storage.findOne({ path: {$all: folder_path}, user: _id}, function(err, found){
    console.log('Founding:', found);
    if (err) callback(err);
    else if (found) callback(null, true);
    else callback(null, false);
  })
};