
////////////////////////////////////////////////////////////////////////////////
///////////////////////// Includes /////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var Pusher = require('pusher');
var _ = require('lodash');
var Q = require('q');
var express = require('express');
var app = express();
var bodyparser = require('body-parser');

var vars = require('./vars');


////////////////////////////////////////////////////////////////////////////////
///////////////////////// HTTP Status Codes ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var HTTP_OK = 200;
var HTTP_CREATED = 201;
var HTTP_NO_CONTENT = 204;
var HTTP_BAD_REQUEST = 400;
var HTTP_NOT_FOUND = 404;
var HTTP_INTERNAL_SERVER_ERROR = 500;


////////////////////////////////////////////////////////////////////////////////
///////////////////////// Listen on the port ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.listen(process.argv[2] || vars.port);


app.use(bodyparser());

////////////////////////////////////////////////////////////////////////////////
///////////////////////// Pusher Stuff             /////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var pusher = new Pusher({
	appId: '94084',
	key: '7bbe1542a659c18b6ee7',
	secret: '75b5563b7fa065798fcf'
});

var participants = {};

app.post("/update", function( req, res ) {
	pusher.trigger('presence-3d-positioning', 'update-from-server', req.body);
	res.status(200).send({});
});


app.post("/pusher/auth", function( req, res ) {
	var query = req.body;
	var socketId = query.socket_id;
	var channel = query.channel_name;
	var callback = query.callback;

	var participantCount = Object.keys(participants).length;

	var presenceData = {
		user_id: socketId,
		user_info: {
			controller: (participantCount === 0)
		}
	};
	participants[participantCount] = presenceData;

	var auth = JSON.stringify(pusher.authenticate( socketId, channel, presenceData ));
	//var cb = callback.replace(/\"/g,"") + "(" + auth + ");";

	res.set({
		"Content-Type": "application/javascript"
	});

	res.send(auth);
});

////////////////////////////////////////////////////////////////////////////////
///////////////////////// Client-side Static Files /////////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.use(express.static(vars.clientDir));
