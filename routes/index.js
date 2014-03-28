
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.upload = require('./upload')
exports.download = require('./download');
exports.initialize = require('./initialize');
exports.list_files = require('./list-files');
exports.delete = require('./delete');