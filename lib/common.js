var common = {};
var q= require('q');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config=require('../config/config.js');
var forEach = require('async-foreach').forEach;
var mime = require('mime');
var fs = require('fs');
var appRoot = require('app-root-path');
var uniqid = require('uniqid');



common.jwtTokenValidation = function(q,req)
{
	var details = {};
	var deferred = q.defer();
	 	

  	var token = req.headers.authorization;

  	token = token.replace('Token ','');

  	console.log('jwt token',token);
  	if (!token){
  		details.status = 401;
  		details.message = "Token Not Provided";
  		deferred.resolve(details);
		deferred.makeNodeResolver();
  	}
  
  	jwt.verify(token, config.secret, function(err, decoded) {
  		console.log('decoded',decoded);
    if (err)
    {
    	details.status = 401;
  		details.message = "Authentication failed";
  		deferred.resolve(details);
		deferred.makeNodeResolver();
    }
    else
    {
    	details.status = 200;
  		details.message = "Authentication sucess";
  		details.details = decoded;
  		deferred.resolve(details);
		deferred.makeNodeResolver();
    }
    });

   return deferred.promise;

}

var base64MimeType = function (encoded) {
  var result = null;

  if (typeof encoded !== 'string') {
    return result;
  }

  var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

  if (mime && mime.length) {
    result = mime[1];
    mime_type = result.split('/');
    result =mime_type[1];
  }

  console.log('mime',result);

  return result;
}

common.multipleImageUpload = function(q,imageArray,userid)
{
    var deferred = q.defer();

    var adImageValues = [];

    forEach(imageArray, function(element, index) {

      var done = this.async();

      try
      {

      var mime_type = base64MimeType(element);
        if(mime_type == '' || mime_type == undefined)
        {
          mime_type ='png';
        }

      var timestamp = uniqid();

      var imageName = userid+"_"+timestamp+'.'+mime_type;

      if(mime_type == 'png')
      element = element.replace(/^data:image\/png;base64,/, "");

      if(mime_type == 'jpeg')
      element = element.replace(/^data:image\/jpeg;base64,/, "");

      if(mime_type == 'jpg')
      element = element.replace(/^data:image\/jpg;base64,/, "");

      element  +=  element.replace('+', ' ');
      var binaryData  =   new Buffer(element, 'base64').toString('binary');
      adImageValues.push(imageName);


        fs.writeFile(config.docroot+'/public/uploads/adimages/'+imageName, binaryData, 'binary', function(err) {

        console.log(err);
        if(!err)
        {

        }
        else
        {
          console.log(err)
        }


      });
      }
      catch(err)
      {
        console.log(err);
      }
                        done();

    });

    deferred.resolve(adImageValues);
    deferred.makeNodeResolver();

    return deferred.promise;

}
common.ImageUpload = function(q,element,userid)
{
    var deferred = q.defer();

    var mime_type = base64MimeType(element);
      if(mime_type == '' || mime_type == undefined)
      {
        mime_type ='png';
      }

    var imageName = userid+"_"+config.currentTimestamp+'.'+mime_type;

    if(mime_type == 'png')
    element = element.replace(/^data:image\/png;base64,/, "");

    if(mime_type == 'jpeg')
    element = element.replace(/^data:image\/jpeg;base64,/, "");

    if(mime_type == 'jpg')
    element = element.replace(/^data:image\/jpg;base64,/, "");

    element  +=  element.replace('+', ' ');
    var binaryData  =   new Buffer(element, 'base64').toString('binary');

      fs.writeFile(config.docroot+'/public/uploads/profile/'+imageName, binaryData, 'binary', function(err) {

      console.log(err);
      if(!err)
      {
          deferred.resolve(imageName);
          deferred.makeNodeResolver();
      }
      else
      {
          console.log(err)
          deferred.resolve(imageName);
          deferred.makeNodeResolver();
      }


    });


    return deferred.promise;

}

common.profileExists = function(profile)
{
  //var hostname = global.settings.hostname;
  var hostname = "http://localhost:5000";
  console.log(appRoot+'public/uploads/profile/'+profile);
  try{
    if (fs.existsSync(appRoot+'/public/uploads/profile/'+profile)) {
      return  hostname+'/'+'public/uploads/profile/'+profile;
    }
    else
    {
      //return  hostname+'/'+config.NO_IMAGE;
      return '';
    }
  }
  catch(ex)
  {
    console.log('error',ex);
  }
}

common.adExists = function(profile)
{
  //var hostname = global.settings.hostname;
  var hostname = "http://localhost:5000";
  //console.log(appRoot+'public/uploads/adimages/'+profile);
  try{
    if (fs.existsSync(appRoot+'/public/uploads/adimages/'+profile)) {
      return  hostname+'/'+'public/uploads/adimages/'+profile;
    }
    else
    {
      //return  hostname+'/'+config.NO_IMAGE;
      return '';
    }
  }
  catch(ex)
  {
    console.log('error',ex);
  }
}

common.extractHastags = function(q,text)
{
    var deferred = q.defer();

    var hashtags = [];

    var text = text.split(" ");

    text.forEach(function(element) {
      if(element.charAt(0) == '#')
      {
        hashtags.push(element);
      }
    });


    deferred.resolve(hashtags);
    deferred.makeNodeResolver();

    return deferred.promise;

}

common.currentDate = function () {
  return new Date()
}
common.currentTimestamp = function () {
  var currentDate = new Date();
  return currentDate.getTime();
}

module.exports = common;
