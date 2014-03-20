var util = require('../modules/utilities'),
    path = require('path');

module.exports = function(req, res){
  console.log('Attempted upload from username:', req.body.username, 'and password', req.body.password);
  if (req.body.username && req.body.password){
    if (req.files.file){
      if (req.body.username === 'clayton' && req.body.password === 'petty'){
        
        var resolved_path = path.resolve('storage', req.body.username);
        util.save(req.files.file, resolved_path, req.files.file.name, function(err){
          if (err) res.send(err);
          else res.send('file saved');
        });
        
      }
      else{
        res.send('No file provided');
      }
    }
  }
  else{
    res.send('Incorrect username or password');
  }
};
