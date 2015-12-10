//models/photo.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var photoSchema = new Schema({
	address: String,
	totalVotes: Number
})

module.exports = mongoose.model('photos', photoSchema)