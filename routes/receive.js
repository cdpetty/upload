var cache = require('memory-cache'),
    util = require('../modules/utilities');
module.exports = function(req, res){
  if (req.files.file && req.body.key){
    if (cache.get(req.params.username)){
      var cached_key = cache.get(req.params.username);
      if (cached_key[0] === req.body.key){
        if (new Date() - cached_key[1] <= 10000){
          cache.del('key');
          util.save(req.files.file, 'storage', req.files.file.name, function(err){
            if (err) res.send(err);
            else res.send('file saved');
          });
        }
        else{
          res.send('key is too old');
        }
      }
      else{
        res.send('Incorrect key');
      }
    }
    else{
      res.send('No key in cache');
    }
  }
};
