var cache = require('memory-cache');

var generate_key = function(){
  var chars = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var length = 90;
  var code = "";
  while (--length >= 0){
    code += chars.charAt(Math.floor(Math.random()*63));
  }
  return code;
};

module.exports = function(req, res){
  if (req.body.password && req.params.username){
    var username = req.params.username;
    if (username === 'clayton' && req.body.password === 'petty'){
      random_string = generate_key();
      cache.put(username, [random_string, new Date()]);
      res.send(cache.get(username)[0]);
    }
  }
};

