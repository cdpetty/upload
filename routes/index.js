
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.receive = require('./server-receive')
exports.send = require('./server-send');
exports.initialize = require('./initialize');
exports.list_files = require('./list-files');
