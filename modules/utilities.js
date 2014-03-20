var fs = require('fs'),
    path = require('path');

/*modules.save takes 2 params with an required callback
 * @file is the file object
 * @dirname is the folder destination for the file
 * The callback is executed on completion with params err, @file
 * if no error, err is will be null
 */
module.exports.save = function(file, dirname, filename, callback){
  fs.exists(path.join(dirname, filename), function(exists){
    if (exists) callback ("File already exists, rename the file");
    else{
      fs.readFile(file.path, function(err, data){
        if (err) callback(err)
        else { 
          fs.writeFile(path.join(dirname, filename), data, function(err){
            if (err) callback(err);
            else callback(err, file);
          });
        }
      });
    }
  });
}
