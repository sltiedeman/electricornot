var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var photoStandings = [];
var allPhotos;
var mongoUrl = 
	process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost:27017/photos';
var db;
/* GET home page. */

MongoClient.connect(mongoUrl, function(error,database){
	database.collection('photos').find().toArray(function(error, result){
		allPhotos = result;
		db = database;
	});
});


router.get('/', function(req, res, next) {
		//1. Get all pictures from the MongoDB
			//2. Get the currrent user from MongoDB
	var currIP = req.ip;
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
			res.render('index', { photos: allPhotos[randomNum]});

		});


	//index page should load random picture/item
	//1. get all pictures from the MongoDB
	//2. Get the current user from MongoDB via req.ip
	//3. Find which photos the current user has NOT voted on
	//4. Load all those photos into an array.
	//5. Choose a random image from the array and set it to a var
	//6. res.render the index view and send it the photo
});

router.get('/intro', function(req, res, next){
	res.render('intro');
});

router.post('/intro', function(req, res, next){
	counter++;
	res.redirect('/');
});

router.get('/standings', function(req, res, next) {
	//1. get ALL the photos
	//2. Sort them by highest likes
	//3. res.render the standings view and pass it the sorted photo array 

		//1. Get all pictures from the MongoDB
		db.collection('photos').find().toArray(function(error, result){
			//Pass all votes

			result.sort(function(p1, p2){
				return (p2.totalVotes - p1.totalVotes);
			});

			res.render('standings', {photosStandings: result});


		});	
});

router.get('/add', function(req, res, next){
	res.render('add');
});


router.post('/add', function(req, res, next){
	console.log(req.body);
		db.collection('photos').save(
	      { "address" : req.body.photoUrl, "totalVotes":0}
	   );
	res.redirect('/');
})


router.post('/reset', function(req, res, next){
		db.collection('photos').find().toArray(function(error, result){
			allPhotos = result;			
		});
	res.redirect('/');
});



router.post('/electric', function(req,res,next){
	
	db.collection('photos').find({address: req.body.photo}).toArray(function(error, result){
		console.log(result);
		var updateVotes = function(db, votes, callback) {
			if(isNaN(votes)){
				votes = 0;
			}
			var newVotes = votes+1;
			
		   db.collection('photos').updateOne(
		      { "address" : req.body.photo },
		      {
		        $set: { "totalVotes": newVotes },
		        $currentDate: { "lastModified": true }
		      }, function(err, results) {
		      // console.log(results);
		      	callback();
		   });
		};

		updateVotes(db,result[0].totalVotes, function() {});
	});


	db.collection('users').insertOne( {
    	ip: req.ip,
    	vote: 'electric',
    	image: req.body.photo
	});
	res.redirect('/');
});

router.post('/poser', function(req,res,next){
	db.collection('photos').find({address: req.body.photo}).toArray(function(error, result){
		console.log(result);
		var updateVotes = function(db, votes, callback) {
			if(isNaN(votes)){
				votes = 0;
			}
			var newVotes = votes-1;
			
		   db.collection('photos').updateOne(
		      { "address" : req.body.photo },
		      {
		        $set: { "totalVotes": newVotes },
		        $currentDate: { "lastModified": true }
		      }, function(err, results) {
		      // console.log(results);
		      	callback();
		   });
		};

		updateVotes(db,result[0].totalVotes, function() {});
	});


	db.collection('users').insertOne( {
    	ip: req.ip,
    	vote: 'poser',
    	image: req.body.photo
	});
	res.redirect('/');
});




module.exports = router;


