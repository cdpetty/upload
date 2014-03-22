//Modules
var path = require('path');

//Route
module.exports = function(req, res){
  //Check for requested user and filename data
  if (req.params.username && req.params.filename){
    
    //Download the file
    res.download(path.resolve('storage', req.params.username, req.params.filename), function(err){
      if (err) res.send('error downloading your file: ' + err);
      else console.log('Error downloading file');
    });
  }
};
