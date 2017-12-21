var config = require('../config');
//leaving config file out of git repo for obvious reasons
var express = require('express');
var mongo = require('mongodb').MongoClient;
var urlExists = require('url-exists'); //for checking valid urls
var router = express.Router()

//get user & pass from config file, set mongoDB url
var user = config.development.database.username;
var pass = config.development.database.password;
var url = "mongodb://" + user + ":" + pass + "@ds163176.mlab.com:63176/url_shortener_db";

//router for use in full url queries
router.use(function(req,res) {
	//start of url to be inserted/built on
	var shortUrl = config.development.shortUrl;

	//getting query from request
	var query = req.url.split('?')[1];

	urlExists(query, function(err, exists) {
		if (err) console.error(err);

		if (exists) {
		//if url exists, check against database
			mongo.connect(url,function(err,db){
				if(err) console.log(err);

    			var docs = db.collection('sites');

    			//see if we have a url matching the query already
    			var result = docs.find({
        			url: query
    			});
	    
	    		result.toArray(function(err,arr){
        			if(err) console.log(err);

        			//building object to return in response
        			var obj = {
	    				original_url:query
	    			};

        			if (!arr[0]) {
        			//if url does not exist in database, find the max 'short_id' in use
        				var max = docs.find({},{'short_id':true}).sort({'short_id':-1}).limit(1);

        				max.toArray(function(err,arr) {
        					if (err) console.error(err);

        					//insert url with next highest 'short_id'
        					var next = Number(arr[0]['short_id']) + 1;
        					
        					var insertObj = {
        						url: query,
        						short_id: next
        					}

        					docs.insert(insertObj, function(err, doc) {
        						if (err) console.error(err);

        						//add short_id to url, add that to object
        						shortUrl += next;
        						obj['short_url'] = shortUrl;

        						//close db connection, send response
        						db.close();
        						res.status(200).json(obj);
    						});
        				});
        				
        			} else {
        				//if url does exist, grab it's short_id, add to short_url, add that to object
        				shortUrl += arr[0]['short_id'];
        				obj['short_url'] = shortUrl;

        				//close db connection and return object
        				db.close();
        				res.status(200).json(obj);
        			}
    			});
	    	});
	    } else {
	    	//if url does not exist, return that fact in json form
			res.status(405).json({error:"URL invalid"});
		}
	});
});

module.exports = router;