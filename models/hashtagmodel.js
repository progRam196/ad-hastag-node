var db = require('../config/dbconnection');
var t=require('../config/table_config.json');
const {ObjectId} = require('mongodb'); // or ObjectID 



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
		'_id':userid,
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

exports.checkHashtag= function(q,tag){
	var deferred = q.defer();

	let match_array = {
	'hashtag':tag
	};
	console.log(match_array);

	var collection = db.get().collection(t.MG_HASHTAGS);
	collection.find(match_array).toArray(function(err, results) {
		console.log(err);
	 	deferred.resolve(results);
		deferred.makeNodeResolver()
		result=null;
	  });

	 return deferred.promise;
}

exports.insertHashtag= function(q,insertArray){
	var deferred = q.defer();

	var collection = db.get().collection(t.MG_HASHTAGS);

	collection.insert(insertArray,function(err, results) {
		//console.log(results);
	 	deferred.resolve(results);
		deferred.makeNodeResolver()
		result=null;
	  });

	 return deferred.promise;
}

exports.hashtagList= function(q,search){
	var deferred = q.defer();

	let match_array = {
	'hashtag_status' : {'$nin':['B','T']}
	};

	if(typeof(search.keyword) != 'undefined' && search.keyword != '')
	{
		//match_array =  { $text: { $search: search.keyword } }
		match_array = {'hashtag':{'$regex':new RegExp(search.keyword)}}
	}

	console.log("matcharray",match_array);

  var arguments = [
		 {
			'$match': match_array,
		},
		{
			'$project':{
				'_id':1,
				'hashtag':'$hashtag',
				'count':{ '$ifNull': [ "$count", 0 ]},
	
			}
		},
		{
			'$sort':{'count':-1}
		}
	];
	var collection = db.get().collection(t.MG_HASHTAGS);
	 collection.aggregate(arguments).toArray(function(err, results) {
		console.log('err',err);
	 	deferred.resolve(results);
		result=null;
	  });

	 return deferred.promise;
}

exports.ad_details= function(q,adId){
	var deferred = q.defer();

	let match_array = {
	'_id':ObjectId(adId)
	};

	console.log(adId);

  var arguments = [
		 {
			'$match': match_array,
		},
		{
			'$lookup':{
                    'from': t.MG_USERS,
                    'localField': 'user_id',
                    'foreignField':'_id',
                    'as':'user',
             },
         },
         {'$unwind':'$user'},
		 {
			'$project':{
				'_id':1,
				'ad_text':'$ad_text',
				'created_date':'$created_date',
				'username':'$user.username',
				'profileImage':'$user.profile_image',
				'ad_image_1':'$ad_image_1',
				'ad_image_2':'$ad_image_2',
				'ad_image_3':'$ad_image_3',
				'ad_image_4':'$ad_image_4',
	
			}
		},
	];
	var collection = db.get().collection(t.MG_ADS);
	 collection.aggregate(arguments).toArray(function(err, results) {
		console.log('err',err);
	 	deferred.resolve(results);
		result=null;
	  });

	 return deferred.promise;
}

exports.update_ads= function(q,updateArray,adId){
	var deferred = q.defer();

	let match_array = {
		'_id':ObjectId(adId),
	};
	console.log('adId',adId)
	var collection = db.get().collection(t.MG_ADS);
	collection.update(match_array,{'$set':updateArray},function(err, results) {
		console.log('err',err);
	 	deferred.resolve(results);
		deferred.makeNodeResolver()
		result=null;
	  });

	 return deferred.promise;
}


exports.updateCount= function(q,hashtagID){
	var deferred = q.defer();

	let match_array = {
		'_id':ObjectId(hashtagID),
	};
	console.log(match_array);
	var collection = db.get().collection(t.MG_HASHTAGS);
	collection.update(match_array,{'$inc':{'count':parseInt(1)}},function(err, results) {
		console.log('err',err);
	 	deferred.resolve(results);
		deferred.makeNodeResolver()
		result=null;
	  });

	 return deferred.promise;
}