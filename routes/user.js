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

	router.post('/verify-token', (req, res) => {

   	  	common.jwtTokenValidation(q,req).then(function(validateResults){

	   	  	if(validateResults.status == 200)
			{
				res.status(200).json({ message: 'success!' , status :200 });
			}
			else
			{
				res.status(401).json({ message: 'failed!' , status :200 });
			}
		});
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

						if(usernameresults > 0)
						{
							try
							{
							var error={};
							error = req.__('username_exists');
							res.status(401).send(error);
							}
							catch(err)
							{
								console.log(err);
							}

						}
						else if(emailresults > 0)
						{
							try
							{
							var error={};
							error = req.__('email_exists');
							res.status(401).send(error);
							}
							catch(err)
							{
								console.log(err);
							}
						}
						else if(phoneresults > 0)
						{
							var error={};
							error = req.__('phone_exists');
							res.status(401).send(error);

						}
						else
						{
					  		try
					  		{
							  var hashedPassword = bcrypt.hashSync(password, 8);

							  var colors = config.colors[Math.floor(Math.random() * config.colors.length)];
							  var imageName = username+'.png';


							  var insert_array = {
							    username : username,
							    email : email,
							    phone : phone,
							    password : hashedPassword,
							    org_password : password,
							    profile_image:imageName,
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

								    imageName=userid+userid+'.png';
								    fs.writeFileSync(config.docroot+'/public/uploads/profile/'+imageName, text2png(username.charAt(0).toUpperCase(), {padding: 30, backgroundColor: colors,
color: 'white'}));
									apimodel.update_user(q,{profile_image:imageName},userid).then(function(results){
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
				   	try
				   	{
				   		var fetch_password = results[0].password;
				   		console.log(hashedPassword);
				   		console.log(fetch_password);
				  		var passwordIsValid = bcrypt.compareSync(hashedPassword, fetch_password);
	    				if (!passwordIsValid)
	    				{
					   		try
					   		{
							   	var userid = results[0]._id;
							   	console.log('user',userid);
							    var token = jwt.sign({ id: userid },config.secret, {
							      expiresIn: 84600 // expires in 24 hours
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
							message = req.__('username_pwd_failed');
						    res.status(401).send(message);
						}
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
				res.status(401).send(error);

			}
			else
			{
				var error= req.__('validation_error');
				res.status(401).send(error);
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
						update_date:new Date()
					};

					if(imageName != undefined && imageName != '')
					update_array.profile_image = imageName;

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
			var sessionUserid = jwtDetails.id;

			var inputParams = req.body;

			if(typeof(inputParams.userid) !=  'undefined' && inputParams.userid != '')
			{
				userid = inputParams.userid;
			}

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

						var follow = profiledetails[0].follower_list.filter(x => x.userid == sessionUserid);

						if(follow.length > 0)
						profiledetails[0].followStatus = parseInt(1);
						else
						profiledetails[0].followStatus = parseInt(0);

						if(sessionUserid == userid)
						profiledetails[0].selfStatus = parseInt(1);
						else
						profiledetails[0].selfStatus = parseInt(0);

						profiledetails[0].imgurl = config.baseurl+'public/uploads/profile/';


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

 router.post('/reset-password', function (req, res) {

  	var message = {};

  	var inputParams = req.body;

  	var validate_error  = validate.resetpassword(q,inputParams);


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
		try
		{
		var resetcode = inputParams.resetcode;
		var password = inputParams.newpassword;
		var repassword = inputParams.confirmpassword;
		const decryptedString = cryptr.decrypt(resetcode);

		console.log(decryptedString);

			apimodel.check_resetcode_exists(q,decryptedString).then(function(findresults){

				if(findresults.length > 0)
				{

					var userid = findresults[0]._id;
					try
					{
					var hashedPassword = bcrypt.hashSync(password, 8);

					var update_array = {
					password : hashedPassword,
					org_password : password,
					resetcode:''
					};

					apimodel.update_user(q,update_array,userid).then(function(results){
						//if (err) return res.status(500).send("There was a problem registering the user.")
						// create a token
						// if(results.ops.length > 0)
						// {	
						message.message = req.__('password_reset_success');
						console.log(message);
						res.status(200).send(message);
						// }
						// else
						// {
						// message = req.__('failed');
						// res.status(500).send(message);

						//}
					});
					}
					catch(err)
					{
					console.log(err);
					}
				}
				else
				{
					message.message = req.__('password_reset_failed');
					res.status(400).send(message);
				}
			});
		}
		catch(err)
		{
			console.log(err);
		}

	}
  });

router.post('/resetlink', function (req, res) {

  	var message = {};

  	var inputParams = req.body;

  	var validate_error  = validate.resetlink(q,inputParams);


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
		var username = inputParams.username;

			apimodel.check_user_exists(q,username).then(function(userresults){

						if(userresults.length > 0)
						{
							try
							{
							var userid = userresults[0]._id;
							var email = userresults[0].email;
							var resetcode = randomstring.generate({
							  length: 12,
							  charset: 'alphabetic'
							});
							var update_array = {'resetcode':resetcode};

							apimodel.update_user(q,update_array,userid).then(function(results){
								try
								{
							const encryptedString = cryptr.encrypt(resetcode);
							var resetlink = config.baseurl+'auth/change-password/'+encryptedString;
							var msg = "Click below link to reset password. <a href='"+resetlink+"'>Reset Link</a>";

							console.log(msg);
							emaillib.sendEmail(email,msg);
							message.message = req.__('reset_email_sent');
							res.status(200).send(message);
						}
						catch(err)
						{
							console.log(err);
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
							message = req.__('enter_valid_username');
							res.status(500).send(message);
						}

			});
	}
  });

router.post('/update-follow', function (req, res) {

   	  	common.jwtTokenValidation(q,req).then(function(validateResults){

   	  	if(validateResults.status == 200)
		{

		var jwtDetails = validateResults.details;
		var userid = jwtDetails.id;

	  	var message = {};

	  	var inputParams = req.body;

	  	var validate_error  = validate.follow(q,inputParams);


		if(validate_error != undefined)
		{
			if(validate_error)
			{
				var error = validate_error;
				res.status(401).send(error);

			}
			else
			{
				var error= req.__('validation_error');
				res.status(401).send(error);
			}
		}
		else
		{
			var follow_user = inputParams.userid;
			var status = inputParams.status;
				apimodel.userDetails(q,userid).then(function(results){
				if(results.length > 0)
				{
					var update_array = {
						'userid':results[0].a,
						'username':results[0].username,
						'description':results[0].description,
						'address':results[0].address,
						'profile_image':results[0].profileImage,
					}

					if(status == 0)
					apimodel.updateFollow(q,update_array,follow_user).then(function(results){});
					else
					apimodel.removeFollow(q,follow_user,update_array.userid).then(function(results){});
				}
				})
				apimodel.userDetails(q,follow_user).then(function(results){
				if(results.length > 0)
				{
					var update_array = {
						'userid':results[0].a,
						'username':results[0].username,
						'description':results[0].description,
						'address':results[0].address,
						'profile_image':results[0].profileImage,
					}

					if(status == 0)
					apimodel.updateFollower(q,update_array,userid).then(function(results){	});
					else
					apimodel.removeFollower(q,userid,update_array.userid).then(function(results){	});
				}
				});
					message.message = req.__('update_success');
					message.details = inputParams;
					res.status(200).send(message);
			
		}
		}
		else
		{
			res.status(validateResults.status).send(validateResults.message);
		}

	});
});

module.exports = router;
