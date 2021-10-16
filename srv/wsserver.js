const express = require('express');
const ws = require('ws');

var port = process.env.PORT || 8080;

const app = express();

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
    
    respStr += '<p id="demo"></p>' + "\n";
    respStr += '' + "\n";
    respStr += '<button onclick="clearInterval(myVar)">Stop time</button>' + "\n";
    respStr += '' + "\n";
    respStr += '<script>' + "\n";
    respStr += 'let myVar = setInterval(myTimer ,1000);' + "\n";
    respStr += 'function myTimer() {' + "\n";
    respStr += '  const d = new Date();' + "\n";
    respStr += '  document.getElementById("demo").innerHTML = d.toLocaleTimeString();' + "\n";
    respStr += '}' + "\n";
    respStr += '</script>' + "\n";

	respStr += '  </body>' + "\n";
	respStr += '</html>' + "\n";
	
	res.status(200).send(respStr);
});

app.get("/main.js", function (req, res) {

	var chatServerURL = "ws://localhost:" + port;
	//var chatServerURL = "wss://chat-srv.cfapps.us10.hana.ondemand.com";

    // var services = null;
	// var vcap_app = null;

	// try {
	// 	xsenv.loadEnv();
	// 	services = xsenv.getServices({
	// 		uaa: { tag: 'xsuaa' },
	// 	});
	// 	vcap_app = JSON.parse(process.env.VCAP_APPLICATION);
	// 	// console.log("uris:" + JSON.stringify(vcap_app.uris, null, 2));
	// 	chatServerURL = vcap_app.uris[0];
	// } catch (e) {
	// 	// console.error(e);
	// 	console.log("Make sure deployed or default-env.json available.")
	// 	console.log("cf de chat-srv");
	// }
	
	console.log("chatServerURL: " + chatServerURL);

	var respStr = "";
	respStr += 'const connection = new WebSocket("' + chatServerURL + '");' + "\n";

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

// Set up a headless websocket server that prints any
// events that come in.
const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', socket => {
    console.log('New Client Joining...');
    socket.on('message', message => {
        console.log('Received:' + message);
        broadcast(message);
    });
});

function broadcast(data) {
    wsServer.clients.forEach(client => {
        if (client.readyState === ws.OPEN) {
        client.send(data);
        }
    });
}
  
let myVar = setInterval(myTimer, 30000);
function myTimer() {
    const d = new Date();
    broadcast("SYS: " + d.toLocaleTimeString());
}

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
const server = app.listen(port);
console.info("Backend: http://localhost:" + port);

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});