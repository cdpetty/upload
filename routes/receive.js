var util = require('../modules/utilities');
module.exports = function(req, res){
  console.log(req.body.username +  ' ' + req.body.password);
  if (req.body.username && req.body.password){
    if (req.files.file){
      if (req.body.username === 'clayton' && req.body.password === 'petty'){
          util.save(req.files.file, 'storage', req.files.file.name, function(err){
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
    res.send('incorrect username or password');
  }
};
