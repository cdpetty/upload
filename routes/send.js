var path = require('path');
module.exports = function(req, res){
  if (req.params.filename){
    res.download(path.resolve('storage/', req.params.filename), function(err){
      console.log('error downloading your file:', err);
      res.send('error downloading your file: ' + err);
    });
  }
};
