'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BookSchema = new Schema({
  name: String,
  owner: String,
  image: String,
  tradeRequests: [], // [{borrowerId: 'proposed', 'accepted', 'denied'}]
  active: Boolean
});

module.exports = mongoose.model('Book', BookSchema);
