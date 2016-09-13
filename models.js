'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var urlSchema = new Schema({
  original_url: String,
  short_url: String,
  _id: {type: Number, index: true},
  created_at: Date
});

var Url = mongoose.model('allUrl', urlSchema);



// create the counters schema with an _id field and a seq field
var CounterSchema = Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});

// create a model from that schema
var counter = mongoose.model('Counter', CounterSchema);



// The pre('save', callback) middleware executes the callback function
// every time before an entry is saved to the urls collection.
urlSchema.pre('save', function(next){
  var doc = this;
  // find the url_count and increment it by 1
  counter.findByIdAndUpdate({_id: 'url_count'}, {$inc: {seq: 1} }, function(error, counter) {
      if (error)
          return next(error);
      // set the _id of the urls collection to the incremented value of the counter
      doc._id = counter.seq;
      doc.created_at = new Date();
      next();
  });
});





module.exports.Url = Url;
