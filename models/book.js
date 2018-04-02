var mongoose = require('mongoose');

var BookSchema = mongoose.Schema({
  title: String,
  author: String,
  numPages: Number
});

BookSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

BookSchema.set('toObject', {
  virtuals: true
});

BookSchema.methods.toJSON = function(){
  var obj = this.toObject();
  delete obj._id;
  delete obj.__v;
  return obj;
}

module.exports = mongoose.model('book', BookSchema);