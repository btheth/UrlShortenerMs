var config = require('./config');
//leaving config file out of git repo for obvious reasons
var urlRouter = require('./controllers/url');
var shortRouter = require('./controllers/short');
var express = require('express');
var logger = require('morgan');
var app = express();
app.use(logger());

app.get('/url', urlRouter);
app.get('/short', shortRouter);

app.use(function(req,res) {
	res.status(405).json({error:"URL invalid"});
});

//listen on port passed as 2nd arg, otherwise port from config file, otherwise listen on port 1337 by default
if (process.argv[2]) {
	app.listen(process.argv[2]);
} else if (config.development.database.port){
	app.listen(Number(config.development.database.port));
} else {
	app.listen(1337);
}