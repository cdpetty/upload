var users = require('../models/users'),
    storage = require('../models/storage');
module.exports = function(req, res){
  users.find({ username: req.params.username }, function(err, found){
    if (err) res.send(err);
    else{
      storage.find({ user: found._id }, function(err, found){
        if (err) res.send(err);
        else{
          var founded = ''
          for (var f in found){
            founded += f.filename;
          }
          res.send(founded);
        }
      });
    }
  });
};