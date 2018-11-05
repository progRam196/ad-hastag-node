var express = require('express'),
    router = express.Router();

var app = require('../app');


var apimodel = require('../models/apimodel');
var config=require('../config/config.js');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

var q= require('q');

var express = require('express'),
    router = express.Router();


router.post('/city-list', (req, res) => {

	var inputParams = req.body;
	var searchKeyword = inputParams.keyword;
	apimodel.cityList(q,searchKeyword).then(function(results){
		res.status(200).json({ message: 'Connected!' , 'details':results});
	})
});

module.exports = router;


