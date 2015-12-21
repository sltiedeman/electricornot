var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Photo = require('../models/photos');
var Users = require('../models/users');
var photoStandings = [];
var allPhotos;
var mongoUrl = 
	process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost:27017/photos';
var db;
mongoose.connect(mongoUrl);


/* GET home page. */
router.get('/photos/get', function(req, res, next){
	Photo.find(function(err, photosResult){
		if(err){
			console.log(err);
		}else{
			res.json(photosResult);
		}
	});
});

router.post('/photos/post', function(req,res,next){
	var photo = new Photo();
	photo.address = req.body.image;
	photo.totalVotes = 0;
	photo.save(function(err){
		if(err){
			console.log(err);
		}else{
			res.json({message: 'Photo added!'});
		}
	})
});

router.put('/photos/update', function(req,res,next){
	Photo.findById(req.params.photo_id, function(err, photosResult){
		if(err){
			console.log(err);
		}else{
			photosResult.address = req.params.photo;  //Change the property of the object we got from Mongo
			photosResult.save(function(err){
				if(err){
					console.log(err);
				}else{
					res.json({message: "Photo was updated!"});
				}
			})
		}
	})
});


router.delete('/photos/delete', function(req,res,next){
	Photo.remove({
		_id: req.params.photo_id
	}, function(err, photo){
		if(err){
			console.log(err);
		}else{
			res.json({message: "Successfully deleted!"});
		}
	});
});

router.get('/users/get', function(req, res, next){
	Users.find(function(err, usersResult){
		if(err){
			console.log(err);
		}else{
			res.json(usersResult);
		}
	});
});

module.exports = router;