var express = require('express'),
    router = express.Router();

var validate=require('../lib/validate.js');
var config=require('../config/config.js');
var hashtagmodel = require('../models/hashtagmodel');
var common = require('../lib/common');
var q= require('q');
const {ObjectId} = require('mongodb'); // or ObjectID 
var forEach = require('async-foreach').forEach;





  router.post('/list', function (req, res) {
  	common.jwtTokenValidation(q,req).then(function(validateResults){

		if(validateResults.status == 200)
		{

			var jwtDetails = validateResults.details;
			console.log("herere");
		  	var message = {};

		  	var search = req.body; 
		  	console.log(search);

		  	hashtagmodel.hashtagList(q,search).then(function(hashtagResults){
		  		message.message = req.__('success');
				let hashtagArray = [];
				  forEach(hashtagResults, function(element, index) {
      				var done = this.async();
					hashtagArray.push(element.hashtag);
					done();
				})
				message.details = hashtagArray;
				res.status(200).send(message);
		  	})
		}
		else
		{
			res.status(validateResults.status).send(validateResults.message);
		}

	});
  });


module.exports = router;
