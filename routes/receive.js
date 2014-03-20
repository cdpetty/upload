var cache = require('memory-cache'),
    util = require('../modules/utilities');
module.exports = function(req, res){
  console.log('a');
  if (req.files.file && req.body.key && req.params.username){
    if (cache.get('key')[0] === req.body.key){
      console.log('b');
      cache.del('key');
      util.save(req.files.file, 'storage', req.files.file.name, function(err){
        console.log('c');
        if (err) res.send(err);
        else res.send('file saved');
      });
    }
    else{
      res.send('Incorrect key');
    }
  }
};
