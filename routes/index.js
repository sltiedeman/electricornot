var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var photoStandings = [];
var allPhotos;
/* GET home page. */

MongoClient.connect('mongodb://localhost:27017/photos', function(error,db){
	db.collection('photos').find().toArray(function(error, result){
		allPhotos = result;
	});
});

router.get('/', function(req, res, next) {
		//1. Get all pictures from the MongoDB
		
			//2. Get the currrent user from MongoDB 
		var currIP = req.ip
		MongoClient.connect('mongodb://localhost:27017/photos', function(error,db){
			db.collection('users').find({ip:currIP}).toArray(function(error, userResult){
				if(userResult.length > 0){
					var index = userResult.length-1;
					var addressCheck = userResult[index].image;
					for(i=0; i<allPhotos.length; i++){
						if(allPhotos[i].address == addressCheck){
							allPhotos.splice(i,1);
						}
					}
				}
				if(allPhotos.length != 0){
					var randomNum = Math.floor(Math.random()*allPhotos.length);
				}else{
					res.redirect('/standings');
				}
				photoStandings = userResult;
				console.log(photoStandings);
				res.render('index', { photos: allPhotos[randomNum]});

			});

		});

	//index page should load random picture/item
	//1. get all pictures from the MongoDB
	//2. Get the current user from MongoDB via req.ip
	//3. Find which photos the current user has NOT voted on
	//4. Load all those photos into an array.
	//5. Choose a random image from the array and set it to a var
	//6. res.render the index view and send it the photo
});

router.get('/standings', function(req, res, next){
// 	//1. get all the photos
// 	//2. sort them by highest likes
// 	//3. res.render the standings view and pass it the sorted photos array
// 	res.render('index', {photos: serverPhotos});
	res.render('standings', {photos: photoStandings});
});

router.post('/electric', function(req, res, next){
	//this will run for all posted pages
	MongoClient.connect('mongodb://localhost:27017/photos', function(error,db){
		db.collection('users').insertOne({
			ip: req.ip,
			vote: "electric",
			image: req.body.photo
		});
		res.redirect('/');
	});
})

router.post('/poser', function(req, res, next){
	MongoClient.connect('mongodb://localhost:27017/photos', function(error, db){
		db.collection('users').insertOne({
			ip: req.ip,
			vote: "poser",
			image: req.body.photo
		});
	});
	res.redirect('/');
})

module.exports = router;


