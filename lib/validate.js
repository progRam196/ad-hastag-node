var validation = {};
var validate = require('validate.js');
var q = require('q');
var apimodel = require('../models/apimodel');



validation.signup = function(q,input)
{
	var constraints = {
		email: {
		presence: {allowEmpty: false,message:"not empty"},
		email: true,
		},		
		phone: {
		presence: {allowEmpty: false,message:"not empty"},
		},
		username: {
		presence: {allowEmpty: false,message:"not empty"}
		},
		password: {
		presence: {allowEmpty: false,message:"not empty"}
		}
	};
	validate.options = {format: "grouped"};
	var result = validate(input, constraints);
	return result;
}

validation.login = function(q,input)
{
	var constraints = {
		username: {
		presence: {allowEmpty: false,message:"not empty"}
		},
		password: {
		presence: {allowEmpty: false,message:"not empty"}
		}
	};
	validate.options = {format: "grouped"};
	var result = validate(input, constraints);
	return result;
}

validation.postad = function(q,input)
{
	var constraints = {
		adtextarea: {
		presence: {allowEmpty: false,message:"not empty"}
		}
	};
	validate.options = {format: "grouped"};
	var result = validate(input, constraints);
	return result;
}

validation.profile = function(q,input)
{
	var constraints = {
		email: {
		presence: {allowEmpty: false,message:"not empty"},
		email: true,
		},		
		phone: {
		presence: {allowEmpty: false,message:"not empty"},
		},
		// password: {
		// presence: {allowEmpty: false,message:"not empty"}
		// },
		description: {
		presence: {allowEmpty: false,message:"not empty"}
		},
		address: {
		presence: {allowEmpty: false,message:"not empty"}
		}
	};
	validate.options = {format: "grouped"};
	var result = validate(input, constraints);
	return result;
}

validation.resetpassword = function(q,input)
{
	var constraints = {
		resetcode: {
		presence: {allowEmpty: false,message:"not empty"},
		},
		newpassword: {
		presence: {allowEmpty: false,message:"not empty"},
		},
		confirmpassword: {
		presence: {allowEmpty: false,message:"not empty"},
		}
	};
	validate.options = {format: "grouped"};
	var result = validate(input, constraints);
	return result;
}

validation.resetlink = function(q,input)
{
	var constraints = {
		username: {
		presence: {allowEmpty: false,message:"not empty"},
		}
	};
	validate.options = {format: "grouped"};
	var result = validate(input, constraints);
	return result;
}

validation.follow = function(q,input)
{
	var constraints = {
	};
	validate.options = {format: "grouped"};
	var result = validate(input, constraints);
	return result;
}

// validate.validators.check_email_exists = function(value) {
// 	console.log("sadgsdg");
// 	apimodel.check_email_exists(q,email).then(function(emailresults){
//   		if(results > 0)
//   			return false;
//   		else
//   			return true;
//   	});
// };

// validate.validators.check_username_exists = function(value) {
//   	apimodel.check_username_exists(q,value,function (results) {
//   		if(results)
//   			return false;
//   		else
//   			return true;
//   	});
// };

// validate.validators.check_phone_exists = function(value) {
//   	apimodel.check_phone_exists(q,value,function (results) {
//   		if(results)
//   			return false;
//   		else
//   			return true;
//   	});
// };


module.exports = validation;
