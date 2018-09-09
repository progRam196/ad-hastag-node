var express = require('express'),
    router = express.Router();

var validate=require('../lib/validate.js');
var config=require('../config/config.js');
var apimodel = require('../models/apimodel');
var q= require('q');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var common = require('../lib/common');



	router.get('/', (req, res) => {
	  res.status(200).json({ message: 'Connected!' });
	});

  router.post('/signup', function (req, res) {

  	var message = {};

  	var inputParams = req.body;

  	var validate_error  = validate.signup(q,inputParams);


	if(validate_error != undefined)
	{
		if(validate_error)
		{
			var error = validate_error;
			res.status(400).send(error);

		}
		else
		{
			var error= req.__('validation_error');
			res.status(400).send(error);
		}
	}
	else
	{
		var email = inputParams.email;
		var phone = inputParams.phone;
		var username = inputParams.username;
		var password = inputParams.password;

			apimodel.check_email_exists(q,email).then(function(emailresults){
				apimodel.check_username_exists(q,username).then(function(usernameresults){
					apimodel.check_phone_exists(q,phone).then(function(phoneresults){

						if(emailresults > 0)
						{
							try
							{
							var error={};
							error.email = req.__('email_exists');
							res.status(400).send(error);
							}
							catch(err)
							{
								console.log(err);
							}
						}
						else if(usernameresults > 0)
						{
							try
							{
							var error={};
							error.username = req.__('username_exists');
							res.status(400).send(error);
							}
							catch(err)
							{
								console.log(err);
							}

						}
						else if(phoneresults > 0)
						{
							var error={};
							error.phone = req.__('phone_exists');
							res.status(400).send(error);

						}
						else
						{
					  		try
					  		{
							  var hashedPassword = bcrypt.hashSync(password, 8);

							  var insert_array = {
							    username : username,
							    email : email,
							    phone : phone,
							    password : hashedPassword,
							    org_password : password,
							    user_status : 'A'
							  };

							  apimodel.insert_user(q,insert_array).then(function(results){
							    //if (err) return res.status(500).send("There was a problem registering the user.")
							    // create a token
							    if(results.ops.length > 0)
							   {	
							   		try
							   		{
								   	var userid = results.ops[0]._id;
								   	console.log('user',userid);
								    var token = jwt.sign({ id: userid },config.secret, {
								      expiresIn: 86400 // expires in 24 hours
								    });
								    message = { auth: true, token: token };
								    res.status(200).send(message);
									}
									catch(err)
									{
										console.log(err);
									}	
								}
								else
								{
									message = req.__('failed');
								    res.status(500).send(message);

								}
							  });
							}
							catch(err)
							{
								console.log(err);
							}
						}
						});
				});
			});
	}
  });

  router.post('/login', function (req, res) {

  	  	var message = {};

  	var inputParams = req.body;

  	var validate_error  = validate.login(q,inputParams);


	if(validate_error != undefined)
	{
		if(validate_error)
		{
			var error = validate_error;
			res.status(400).send(error);

		}
		else
		{
			var error= req.__('validation_error');
			res.status(400).send(error);
		}
	}
	else
	{
		console.log("herere");
		var username = inputParams.username;
		var password = inputParams.password;

  		try
		  		{
				  var hashedPassword = bcrypt.hashSync(password, 8);		  

				  var update_array = {
				  	login_status:'S',
				  	update_date:new Date()
				  };

				  apimodel.check_login(q,username).then(function(results){
				    //if (err) return res.status(500).send("There was a problem registering the user.")
				    // create a token
				    console.log(results);
				    if(results.length > 0)
				   {	
				   		var fetch_password = results[0].password;
				  		var passwordIsValid = bcrypt.compareSync(hashedPassword, fetch_password);
	    				if (!passwordIsValid)
	    				{
					   		try
					   		{
							   	var userid = results[0]._id;
							   	console.log('user',userid);
							    var token = jwt.sign({ id: userid },config.secret, {
							      expiresIn: 86400 // expires in 24 hours
							    });
								apimodel.update_user(q,update_array,userid).then(function(results){
									    message = { auth: true, token: token };
									    res.status(200).send(message);
								})
							}
							catch(err)
							{
								console.log(err);
							}	
						}
						else
						{
							message = req.__('failed');
						    res.status(401).send(message);
						}
					}
					else
					{
						message = req.__('failed');
					    res.status(500).send(message);
					}
				  });
				}
				catch(err)
				{
					console.log(err);
				}
	}

  });

   router.post('/update-profile', function (req, res) {

   	  	common.jwtTokenValidation(q,req).then(function(validateResults){

   	  	if(validateResults.status == 200)
		{

		var jwtDetails = validateResults.details;
		var userid = jwtDetails.id;

	  	var message = {};

	  	var inputParams = req.body;

	  	var validate_error  = validate.profile(q,inputParams);


		if(validate_error != undefined)
		{
			if(validate_error)
			{
				var error = validate_error;
				res.status(400).send(error);

			}
			else
			{
				var error= req.__('validation_error');
				res.status(400).send(error);
			}
		}
		else
		{
				console.log("herere");
				var username = inputParams.username;
				var password = inputParams.password;
				var email = inputParams.email;
				var phone = inputParams.phone;
				var description = inputParams.description;
				var address = inputParams.address;
				var profileImage = inputParams.profileImage;

		   		common.ImageUpload(q,profileImage,userid).then(function(imageName)
		   		{
					var update_array = {
						email:email,
						phone:phone,
						description:description,
						address:address,
						profile_image:imageName,
						update_date:new Date()
					};
					apimodel.update_user(q,update_array,userid).then(function(results){
						    message.message = req.__('update_success');
						    message.details = inputParams;
				    		res.status(200).send(message);
					});
				});
			}
		}
		else
		{
			res.status(validateResults.status).send(validateResults.message);
		}

	});
});

   router.post('/profile', function (req, res) {

   	  	common.jwtTokenValidation(q,req).then(function(validateResults){

   	  	if(validateResults.status == 200)
		{
			try
			{
			var jwtDetails = validateResults.details;
			var userid = jwtDetails.id;

		  	var message = {};

		  	console.log(userid);

			apimodel.userDetails(q,userid).then(function(results){
				if(results.length > 0)
				{
					try
					{
						var profiledetails = results;
						profiledetails.forEach(function(element) {
							profiledetails[0].profileImage = common.profileExists(profiledetails[0].profileImage);
						});
						delete profiledetails._id;

					    message.message = req.__('success');
					    message.details = profiledetails[0];
			    		res.status(200).send(message);
				    }
					catch(err)
					{
						console.log(err);
					}
		    	}
		    	else
		    	{
		    		 message.message = req.__('no_data');
				    console.log(profiledetails);
		    		res.status(400).send(message);
		    	}
		    })
			}
			catch(err)
			{
				console.log(err);
			}
		}
		else
		{
			res.status(validateResults.status).send(validateResults.message);
		}
	});
});

module.exports = router;
