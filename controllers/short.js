var config = require('../config');
//leaving config file out of git repo for obvious reasons
var express = require('express');
var mongo = require('mongodb').MongoClient;
var router = express.Router()

//get user & pass from config file, set mongoDB url
var user = config.development.database.username;
var pass = config.development.database.password;
var url = "mongodb://" + user + ":" + pass + "@ds163176.mlab.com:63176/url_shortener_db";

//router for short in short url queries
router.use(function(req,res) {
	//get shortUrl from configs and query from request
	var shortUrl = config.development.shortUrl;
	var query = req.url.split('?')[1];

	//connect to mongo
	mongo.connect(url,function(err,db){
		if(err) console.log(err);

		//load collection
    	var docs = db.collection('sites');

    	//filter for documents with short_id matching query
    	var results = docs.find({
    		short_id: Number(query)
    	});

    	//turn results into array
    	results.toArray(function(err,arr) {
			if (err) console.error(err);
			
			//if no results found, close db and return that fact in json form
			if (!arr[0]) {
				db.close();
				res.status(405).json({error:"URL invalid"});
			} else {
				//if we found short_id, close db and redirect to appropriate page based on url
				db.close();
        		res.status(302).redirect(arr[0]['url']);
			}

    	});
    });
});

module.exports = router;