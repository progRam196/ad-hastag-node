var express = require('express'),
    router = express.Router();

var validate=require('../lib/validate.js');
var config=require('../config/config.js');
var emaillib=require('../lib/email.js');
var apimodel = require('../models/apimodel');
var q= require('q');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var common = require('../lib/common');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(config.secret);
var randomstring = require("randomstring");
var text2png = require('text2png');
var fs = require('fs');



	router.get('/', (req, res) => {
	  res.status(200).json({ message: 'Connected!' });
	});

  router.post('/settings', function (req, res) {

  	var message = {};


	apimodel.siteSettings(q).then(function(results){
	message.details = results[0];
	res.status(200).send(message);
	})
  });

  router.post('/contact-us', function (req, res) {

  	var message = {};
  	var inputParams = req.body;
  	var insertArray = {
  		'message':inputParams.message
  	};

	apimodel.insertEnquiry(q,insertArray).then(function(results){
	message.details = results[0];
	res.status(200).send(message);
	})
  });


module.exports = router;
