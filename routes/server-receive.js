var util = require('../modules/utilities'),
    path = require('path'),
    storage = require('../models/storage'),
    users = require('../models/users');

module.exports = function(req, res){
  console.log('Attempted upload from username:', req.body.username, 'and password', req.body.password);
  if (req.body.username && req.body.password){
    if (req.files.file){
      users.find({ username: req.body.username, password: req.body.password }, function(err, found){
        if (err) res.send(err);
        else{
          var new_file = new storage();
          new_file.filename = req.files.file.name;
          new_file.date = new Date();
          new_file.user = found._id;
          new_file.save(function(err){
            if (err) res.send(err);
            else{
              var resolved_path = path.resolve('storage', req.body.username);
              util.save(req.files.file, resolved_path, req.files.file.name, function(err){
                if (err) res.send(err);
                else res.send('File saved');
              });
            }
          });
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
