/*eslint no-console: 0*/
"use strict";

var xsenv = require("@sap/xsenv");
var express = require("express");

// var stringifyObj = require("stringify-object");

const WebSocket = require("ws");

var server = require("http").createServer();
var port = process.env.PORT || 8080;

var app = express();
const webSocketServer = new WebSocket.Server({ server: app });

webSocketServer.on('connection', webSocket => {
  console.log('New Client Joining...');
  webSocket.on('message', message => {
    console.log('Received:', message);
    broadcast(message);
  });
});

function broadcast(data) {
  webSocketServer.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// app.get("/", function (req, res) {

// 	var responseStr = "";
// 	responseStr += "<!DOCTYPE HTML><html><head><title>CHAT</title></head><body><h1>websocket chat</h1><br />";
// 	responseStr += "<a href=\"/chat\">Start Chat</a><br />";
// 	responseStr += "<br />";
// 	responseStr += "<a href=\"/\">Return to home page.</a><br />";
// 	responseStr += "</body></html>";
// 	res.status(200).send(responseStr);
// });

app.get("/", function (req, res) {

	var respStr = "";
	respStr += '<!DOCTYPE html>' + "\n";
	respStr += '<html lang="en" dir="ltr">' + "\n";
	respStr += '  <head>' + "\n";
	respStr += '	<meta charset="utf-8" />' + "\n";
	respStr += '	<title>Web Socket Demo</title>' + "\n";
	respStr += '  </head>' + "\n";
	respStr += '  <body>' + "\n";
	respStr += '' + "\n";
	respStr += '	<textarea rows="1" cols="80" id="nick"></textarea>' + "\n";
	respStr += '' + "\n";
	respStr += '	<form>' + "\n";
	respStr += '	  <textarea rows="8" cols="80" id="message"></textarea>' + "\n";
	respStr += '	  <br />' + "\n";
	respStr += '	  <button type="submit">Send</button>' + "\n";
	respStr += '	</form>' + "\n";
	respStr += '' + "\n";
	respStr += '	<ul id="chat"></ul>' + "\n";
	respStr += '' + "\n";
	respStr += '	<script src="main.js">' + "\n";
	respStr += '' + "\n";
	respStr += '	</script>' + "\n";
	respStr += '  </body>' + "\n";
	respStr += '</html>' + "\n";
	
	res.status(200).send(respStr);
});

app.get("/main.js", function (req, res) {

	var chatServerHost = "localhost:" + port;
	var services = null;
	var vcap_app = null;

	try {
		xsenv.loadEnv();
		services = xsenv.getServices({
			uaa: { tag: 'xsuaa' },
		});
		vcap_app = JSON.parse(process.env.VCAP_APPLICATION);
		// console.log("uris:" + JSON.stringify(vcap_app.uris, null, 2));
		chatServerHost = vcap_app.uris[0];
	} catch (e) {
		// console.error(e);
		console.log("Make sure deployed or default-env.json available.")
		console.log("cf de chat-srv");
	}
	
	console.log("chatServerHost: " + chatServerHost);

	var respStr = "";
	respStr += 'const connection = new WebSocket("wss://' + chatServerHost + '");' + "\n";

	respStr += 'connection.onopen = () => {' + "\n";
	respStr += '  console.log("connected");' + "\n";
	respStr += '};' + "\n";
	respStr += '' + "\n";
	respStr += 'connection.onclose = () => {' + "\n";
	respStr += '  console.error("disconnected");' + "\n";
	respStr += '};' + "\n";
	respStr += '' + "\n";
	respStr += 'connection.onerror = error => {' + "\n";
	respStr += '  console.error("failed to connect", error);' + "\n";
	respStr += '};' + "\n";
	respStr += '' + "\n";
	respStr += 'connection.onmessage = event => {' + "\n";
	respStr += '  console.log("received", event.data);' + "\n";
	respStr += '  let li = document.createElement("li");' + "\n";
	respStr += '  li.innerText = event.data;' + "\n";
	respStr += '  document.querySelector("#chat").append(li);' + "\n";
	respStr += '};' + "\n";
	respStr += '' + "\n";
	respStr += 'document.querySelector("form").addEventListener("submit", event => {' + "\n";
	respStr += '  event.preventDefault();' + "\n";
	respStr += '  let nick = document.querySelector("#nick").value;' + "\n";
	respStr += '  let message = document.querySelector("#message").value;' + "\n";
	respStr += '  connection.send(nick + ": " + message);' + "\n";
	respStr += '  document.querySelector("#message").value = "";' + "\n";
	respStr += '});' + "\n";
	
	res.status(200).send(respStr);
});

server.on("request", app);

server.listen(port, function () {
	console.info("Backend: http://localhost:" + server.address().port);
});
