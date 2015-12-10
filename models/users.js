//models/photo.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
	ip: String,
	vote: Number,
	image: String
})

module.exports = mongoose.model('users', usersSchema);

