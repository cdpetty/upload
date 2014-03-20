var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var storageSchema = Schema({
    filename: String,
    date: Date,
    user: ObjectId
});

var storage = mongoose.model('storage', storageSchema);

module.exports = storage;
