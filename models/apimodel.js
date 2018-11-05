var db = require('../config/dbconnection');
const {ObjectId} = require('mongodb'); // or ObjectID 
var t=require('../config/table_config.json');


exports.insert_user= function(q,insertArray){
	var deferred = q.defer();

	var collection = db.get().collection(t.MG_USERS);
	collection.insert(insertArray,function(err, results) {
		//console.log(results);
	 	deferred.resolve(results);
		deferred.makeNodeResolver()
		result=null;
	  });

	 return deferred.promise;
}


exports.check_email_exists= function(q,data){
	var deferred = q.defer();

	let match_array = {
	"email":data,
	};
	console.log("asdfsdgsfg");

	var collection = db.get().collection(t.MG_USERS);
	collection.count(match_array,function(err, results) {
		console.log(err);
		console.log(results);
	 	deferred.resolve(results);
		deferred.makeNodeResolver()
		result=null;
	  });

	 return deferred.promise;
}

exports.check_phone_exists= function(q,data){
	var deferred = q.defer();

	let match_array = {
	"phone":data
	};

	console.log(match_array);

	var collection = db.get().collection(t.MG_USERS);
	collection.count(match_array,function(err, results) {
		console.log(err);
		console.log('phone',results);
	 	deferred.resolve(results);
		deferred.makeNodeResolver()
		result=null;
	  });

	 return deferred.promise;
}

exports.check_username_exists= function(q,data){
	var deferred = q.defer();

	let match_array = {
	"username":data
	};

	var collection = db.get().collection(t.MG_USERS);
	collection.count(match_array,function(err, results) {
		console.log(err);
		console.log(results);
	 	deferred.resolve(results);
		deferred.makeNodeResolver()
		result=null;
	  });

	 return deferred.promise;
}

exports.update_user= function(q,updateArray,userid){
	var deferred = q.defer();

	let match_array = {
		'_id':ObjectId(userid),
	};
	var collection = db.get().collection(t.MG_USERS);
	collection.update(match_array,{'$set':updateArray},function(err, results) {
		console.log('err',err);
	 	deferred.resolve(results);
		deferred.makeNodeResolver()
		result=null;
	  });

	 return deferred.promise;
}

exports.check_login= function(q,username){
	var deferred = q.defer();

	let match_array = {
	'$or':[{"phone":username},{"username":username},{"email":username}],
//	'password':password
	};
	console.log(match_array);

	var collection = db.get().collection(t.MG_USERS);
	collection.find(match_array).toArray(function(err, results) {
		console.log(err);
	 	deferred.resolve(results);
		deferred.makeNodeResolver()
		result=null;
	  });

	 return deferred.promise;
}

exports.userDetails= function(q,userid){
	var deferred = q.defer();

	let match_array = {
	'_id':ObjectId(userid)
	};

  var arguments = [
		 {
			'$match': match_array,
		},
		 {
			'$project':{
				'_id':0,
				'username':'$username',
				'email':'$email',
				'phone':'$phone',
				//'password':'$password',
				'description': { $ifNull : ['$description','']},
				'address': { $ifNull : ['$address','']},
				'profileImage': { $ifNull : ['$profile_image','']}
			}
		},
	];
	var collection = db.get().collection(t.MG_USERS);
	 collection.aggregate(arguments).toArray(function(err, results) {
		console.log('err',err);
	 	deferred.resolve(results);
		result=null;
	  });

	 return deferred.promise;
}


exports.check_user_exists= function(q,data){
	var deferred = q.defer();

	let match_array = {
		'$or':[
		{"email":data},
		{"phone":data},
		{"username":data}
		]
	};

	var collection = db.get().collection(t.MG_USERS);
	collection.find(match_array).toArray(function(err, results) {
		console.log(err);
	 	deferred.resolve(results);
		deferred.makeNodeResolver()
		result=null;
	  });

	 return deferred.promise;
}
exports.check_resetcode_exists= function(q,data){
	var deferred = q.defer();

	let match_array = {
		'resetcode':data
	};

	var collection = db.get().collection(t.MG_USERS);
	collection.find(match_array).toArray(function(err, results) {
		console.log(err);
		console.log(results);
	 	deferred.resolve(results);
		deferred.makeNodeResolver()
		result=null;
	  });

	 return deferred.promise;
}

exports.cityList= function(q,data){
	var deferred = q.defer();

	if(typeof(data) != 'undefined')
	{
	var match_array = {'name':{'$regex':new RegExp(data)}};
	}
	else
	{
	var match_array = {};
	}

	var collection = db.get().collection(t.MG_CITY);
	collection.find(match_array).limit(10).toArray(function(err, results) {
		console.log(err);
	 	deferred.resolve(results);
		deferred.makeNodeResolver()
		result=null;
	  });

	 return deferred.promise;
}

exports.insertCity= function(q,insertArray){
	var deferred = q.defer();

	var collection = db.get().collection(t.MG_CITY);
	collection.insert(insertArray,function(err, results) {
		//console.log(results);
	 	deferred.resolve(results);
		deferred.makeNodeResolver()
		result=null;
	  });

	 return deferred.promise;
}