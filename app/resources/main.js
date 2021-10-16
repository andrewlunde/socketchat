//var xsenv = require("@sap/xsenv");

var chatServerURL = "https://chat-srv.cfapps.eu10.hana.ondemand.com";

const destinations = JSON.parse(process.env.destinations);
destinations.forEach(destination => {
	if (destination.name == "chat_be") {
		chatServerURL = destination.url;
	}
});

const connection = new WebSocket('ws://' + chatServerURL);

connection.onopen = () => {
  console.log('connected');
};

connection.onclose = () => {
  console.error('disconnected');
};

connection.onerror = error => {
  console.error('failed to connect', error);
};

connection.onmessage = event => {
  console.log('received', event.data);
  let li = document.createElement('li');
  li.innerText = event.data;
  document.querySelector('#chat').append(li);
};

document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault();
  let nick = document.querySelector('#nick').value;
  let message = document.querySelector('#message').value;
  connection.send(nick + ": " + message);
  document.querySelector('#message').value = '';
});
