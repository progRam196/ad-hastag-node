var db = require('../config/dbconnection');
var t=require('../config/table_config.json');
const {ObjectId} = require('mongodb'); // or ObjectID 


exports.insert_ads= function(q,insertArray){
	var deferred = q.defer();

	var collection = db.get().collection(t.MG_ADS);

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

exports.user_ads_list= function(q,userid,search){
	var deferred = q.defer();

	let match_array = {
	'user_id':ObjectId(userid),
	'ad_status' : {'$nin':['B','T']}
	};

	if(typeof(search.hashtags) != 'undefined')
	{
		match_array =  { $text: { $search: search.hashtags } }

	}

	console.log("matcharray",match_array);

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
				'created_date_format':{
				'$dateFromString': {
            	'dateString': '$created_date',
            	'timezone': 'Asia/Kolkata',
           	    'format': "%d-%m-%Y",
                'onError': '$created_date'

         		}
         		},
				'username':'$user.username',
				'profileImage':'$user.profile_image',
				'ad_image_1':'$ad_image_1',
				'ad_image_2':'$ad_image_2',
				'ad_image_3':'$ad_image_3',
				'ad_image_4':'$ad_image_4',
				'show_text':'$show_text',
				'hastags':'$hastags',
				'userid':'$user_id',
				'websitelink':{'$ifNull':['$websitelink','']},
				'city':{'$ifNull':['$city','']}
	
			}
		},
		{ '$sort' : { 'created_date' : -1 } }

	];
	var collection = db.get().collection(t.MG_ADS);
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
				'created_date_format':{
				'$dateFromString': {
            	'dateString': '$created_date',
            	'timezone': 'Asia/Kolkata',
           	    'format': "%d-%m-%Y",
                'onError': '$created_date'

         		}
         		},
				'username':'$user.username',
				'profileImage':'$user.profile_image',
				'ad_image_1':'$ad_image_1',
				'ad_image_2':'$ad_image_2',
				'ad_image_3':'$ad_image_3',
				'ad_image_4':'$ad_image_4',
				'show_text':'$show_text',
				'hastags':'$hastags',
				'userid':'$user_id',
				'websitelink':{'$ifNull':['$websitelink','']},
				'city':{'$ifNull':['$city','']}

	
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


exports.ads_list= function(q,userid,search){
	var deferred = q.defer();

	let match_array = {
	'ad_status' : {'$nin':['B','T']}
	};

	if(typeof(userid) != 'undefined' && userid != '' )
	{
	match_array.user_id={'$ne':ObjectId(userid)};
	}
	if(typeof(search.hashtags) != 'undefined' && search.hashtags != '' )
	{
		match_array.$text = { $search: search.hashtags.join(' ') } 
	}
	console.log('search',search);
	if(typeof(search.city) != 'undefined' && search.city != '' && search.city != null)
	{
		match_array.city = search.city; 
	}

	console.log("matcharray",match_array);

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
        // {'$unwind':'$hastags'},
		 {
			'$project':{
				'_id':1,
				'ad_text':'$ad_text',
				'created_date':'$created_date',
				'created_date_format':{
				'$dateFromString': {
            	'dateString': '$created_date',
            	'timezone': 'Asia/Kolkata',
           	    'format': "%d-%m-%Y",
                'onError': '$created_date'

         		}
         		},
				'username':'$user.username',
				'profileImage':'$user.profile_image',
				'ad_image_1':'$ad_image_1',
				'ad_image_2':'$ad_image_2',
				'ad_image_3':'$ad_image_3',
				'ad_image_4':'$ad_image_4',
				'show_text':'$show_text',
				'hastags':'$hastags',
				'userid':'$user_id',
				'websitelink':{'$ifNull':['$websitelink','']},
				'city':{'$ifNull':['$city','']}

	
			}
		},
		{ '$sort' : { 'created_date' : -1 } }
			
	];
	var collection = db.get().collection(t.MG_ADS);
	 collection.aggregate(arguments).toArray(function(err, results) {
		console.log('err',err);
	 	deferred.resolve(results);
		result=null;
	  });

	 return deferred.promise;
}


exports.updateMessage= function(q,message_array,adId){
	var deferred = q.defer();

	let match_array = {
		'_id':ObjectId(adId),
	};

	console.log(match_array);
	var collection = db.get().collection(t.MG_ADS);
	collection.update(match_array,{'$push':{'message_list':message_array}},{ upsert: false }
,function(err, results) {
		console.log('err',err);
	 	deferred.resolve(results);
		deferred.makeNodeResolver()
		result=null;
	  });

	 return deferred.promise;
}

exports.message_details= function(q,adId){
	var deferred = q.defer();

	let match_array = {
	'_id':ObjectId(adId)
	};

	console.log(adId);

  var arguments = [
		 {
			'$match': match_array,
		},
        {'$unwind':'$message_list'},
		{
			'$lookup':{
                    'from': t.MG_USERS,
                    'localField': 'message_list.userid',
                    'foreignField':'_id',
                    'as':'user',
             },
         },
         {'$unwind':'$user'},
		 {
			'$project':{
				'_id':1,
				'message':'$message_list.message',
				'message_create_date':'$message_list.created_date',
				'user_profile':'$user.profile_image',
				'username':'$user.username',
	
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
