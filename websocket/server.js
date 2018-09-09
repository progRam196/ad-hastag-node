var socketobj = {};
var q= require('q');
var validate = require("validate.js");
var i18n = require('i18n');



module.exports = function(io)
{
	// Emit welcome message on connection
	io.on('connection', function(socket)
	{
		console.log( socket.id + ' - connected..' );

		//console.log( socket);

		socketobj[sessiondriver].on('connect', function(event)
		{
			console.log(event);
		});

		socketobj[sessiondriver].removeAllListeners('connect');


		// //Sending Data to users on connect
		// socketobj[sessiondriver].emit(
		// 				'broadcast_data',
		// 				{
		// 					message: 'Welcome!',
		// 					id: socket.id
		// 				}
		// 			);

		socketobj[sessiondriver].on('error', function(error)
		{
			console.log( 'Error - ' + JSON.stringify(error) );
		});

		socketobj[sessiondriver].on('disconnect', function(event_name)
		{
			console.log( 'Disconnected.. - ' + socket.id );
			//console.log( event_name );
		});
	});
}




