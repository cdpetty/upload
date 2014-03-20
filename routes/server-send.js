var path = require('path');
module.exports = function(req, res){
  if (req.params.username && req.params.filename){
    res.download(path.resolve('storage', req.params.username, req.params.filename), function(err){
      if (err) res.send('error downloading your file: ' + err);
      else res.send('File Downloaded');
    });
  }
};
