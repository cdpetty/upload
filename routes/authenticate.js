var cache = require('memory-cache');

module.exports = function(req, res){
  console.log('a', req.body.password, req.params.username);
  if (req.body.password && req.params.username){
    console.log('b');
    if (req.params.username === 'clayton' && req.body.password === 'petty'){
      console.log('c');
      random_string = 'RANDOM STRING';
      cache.put('key', [random_string, new Date()]);
      res.send(cache.get('key')[0]);
    }
  }
};
