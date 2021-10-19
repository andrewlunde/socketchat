const express = require('express');
const ws = require('ws');

var port = process.env.PORT || 8080;

const app = express();

app.get("/", function (req, res) {
	
    var respStr =
`<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
    <meta charset="utf-8" />
    <title>Web Socket Demo</title>
    </head>
    <body>

    <textarea rows="1" cols="80" id="nick"></textarea>

    <form>
        <textarea rows="8" cols="80" id="message"></textarea>
        <br />
        <button type="submit">Send</button>
    </form>

    <ul id="chat"></ul>

    <script src="main.js">

    </script>
<p id="demo"></p>

<button onclick="clearInterval(myVar)">Stop time</button>

<script>
let myVar = setInterval(myTimer ,1000);
function myTimer() {
    const d = new Date();
    document.getElementById("demo").innerHTML = d.toLocaleTimeString();
}
</script>
    </body>
</html>`;

	res.status(200).send(respStr);
});

// to change icon
// make an icon maybe here: http://www.favicon.cc/ or here :http://favicon-generator.org
// convert it to base64 maybe here: http://base64converter.com/
// then replace the icon base 64 value

const favicon = new Buffer.from('AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAACwOAAAsDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgHyMAIR8jACAfI1kgHyPnIB8j8yAfI/IgHyPyIB8j8iAfI/IgHyPyIB8j8iAfI/IgHyPyAAAAAAAAAAAgHyMAIB8jACAfI0wgHyPiIB8j/yAfI/8gHyP/IB8j/yAfI/8gHyP/IB8j/yAfI/8gHyP/IB8j/wAAAAAgHyMAIB8jACAfI0ggHyPkIB8j/yAfI/YgHyO3IB8jpiAfI6cgHyOnIB8jqCAfI6kgHyOpIB8jpyAfI6kAAAAAIB8jACAfIwAgHyNRIB8j7CAfI/kgHyN/IB8jEiAfIyAgHyMhIB8jIiAfIxAgHyMBIB8jCiAfIx8gHyMgAAAAAAAAAAAgHyMAIB4jACAfI2AgHyOBIB8jFSAfI5MgHyPhIB8j4yAfI7UgHyMkVGAwACAfIzogHyPYIB8j4AAAAAAAAAAAIB8jACAfIwYgHyN9IB8jpiAfI54gHyP8IB8j/yAfI9cgHyM4IB8jPCAfI1AgHyNAIB8j9yAfI/8AAAAAIB8jACAfIwYgHyN7IB8j9iAfI/8gHyP+IB8j/yAfI9cgHyM4IB8jNiAfI9kgHyN3IB8jPiAfI/cgHyP/IB8jACAfIwYgHyN5IB8j9iAfI/8gHyP/IB8j/yAfI/MgHyNNIB8jNCAfI9QgHyP/IB8jdSAfIz4gHyP3IB8j/yAfIwYgHyN3IB8j9SAfI/8gHyPoIB8j3SAfI/8gHyP8IB8jtCAfI9MgHyP/IB8j/SAfI2QgHyM/IB8j9yAfI/8gHyNPIB8j9CAfI/8gHyPoIB8jUyAfIzQgHyPQIB8j/yAfI/8gHyP/IB8j/CAfI5kgHyMVIB8jgyAfI/4gHyP/IB8jaSAfI/8gHyP8IB8jaSAfIwAgHyMAIB8jNSAfI9AgHyP/IB8j/yAfI9sgHyMuIB8jdiAfI/YgHyP/IB8j5SAfI18gHyPoIB8j3iAfIzogHyMAIB8jACAfIwAgHyNxIB8j/SAfI/8gHyPwIB8jfiAfI94gHyP/IB8j5yAfI1QgHyMPIB8jJSAfIyQgHyMJIB8jACAfIwAgHyNGIB8j3iAfI/8gHyP5IB8jhCAfIwwgHyNlIB8j2CAfI1YgHyMAIB8jbyAfI50gHyObIB8jnSAfI54gHyOhIB8j4SAfI/8gHyP5IB8jhyAfIwkgHyMAIB8jBSAfIyIgHyMDIB8jACAfI/ggHyP/IB8j/yAfI/8gHyP/IB8j/yAfI/8gHyP5IB8jiCAfIwogHyMAAAAAAAAAAAAAAAAAAAAAAAAAAAAgHyP/IB8j/yAfI/8gHyP/IB8j/yAfI/8gHyP/IB8jnCAfIwwgHyMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+AAAAPAAAADgAAAA4AAAAOAIAADgAAAAwAAAAIAAAAAAAAAAAAAAAAwAAAAOAAAADAAAAAARAAAAPwAAAH8AAA==', 'base64'); 
app.get("/favicon.ico", function(req, res) {
 res.statusCode = 200;
 res.setHeader('Content-Length', favicon.length);
 res.setHeader('Content-Type', 'image/x-icon');
 res.setHeader("Cache-Control", "public, max-age=2592000");                // expiers after a month
 res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
 res.end(favicon);
});

app.get("/main.js", function (req, res) {

    var chatServerURL = "ws://localhost:" + port;
    //var chatServerURL = "wss://chat-srv.cfapps.us10.hana.ondemand.com";

    // If deployed in BTP CF then pick the first uri found in VCAP_APPLICATION
    if (typeof process !== 'undefined' && process) {
        if (typeof process.env !== 'undefined' && process.env) {
            if (typeof process.env.VCAP_APPLICATION !== 'undefined' && process.env.VCAP_APPLICATION) {
                const vcap_app = JSON.parse(process.env.VCAP_APPLICATION);
                if (typeof vcap_app.uris !== 'undefined' && vcap_app.uris) {
                    chatServerURL = "wss://" + vcap_app.uris[0];
                }
            }
        }
    }

    // If deployed in BTP Kyma then derive hostname from KUBERNETES_SERVICE_HOST & HOSTNAME
    // Local testing of this logic
    // export KUBERNETES_SERVICE_HOST=api.fe879d9.kyma.internal.live.k8s.ondemand.com
    // export HOSTNAME=socketchat-68db7dcc66-c924m
    if (typeof process !== 'undefined' && process) {
        if (typeof process.env !== 'undefined' && process.env) {
            if (typeof process.env.KUBERNETES_SERVICE_HOST !== 'undefined' && process.env.KUBERNETES_SERVICE_HOST) {
                const service_host = process.env.KUBERNETES_SERVICE_HOST;
                if (typeof process.env.HOSTNAME !== 'undefined' && process.env.HOSTNAME) {
                    const host_name = process.env.HOSTNAME;

                    var svc_parts = service_host.split(".");
                    var hst_parts = host_name.split("-");
                    // chatServerURL = "wss://" + hst_parts[0] + service_host.substr(svc_parts[0].length, service_host.length - svc_parts[0].length);
                    chatServerURL = "wss://" + hst_parts[0] + "." + svc_parts[1] + ".kyma.shoot.live.k8s-hana.ondemand.com";

                }
            }
        }
    }

	console.log("chatServerURL: " + chatServerURL);
    
    var respStr =
`const connection = new WebSocket("` + chatServerURL + `");
connection.onopen = () => {
    console.log("connected");
};

connection.onclose = () => {
    console.error("disconnected");
};

connection.onerror = error => {
    console.error("failed to connect", error);
};

connection.onmessage = event => {
    console.log("received", event.data);
    let li = document.createElement("li");
    li.innerText = event.data;
    document.querySelector("#chat").append(li);
};

document.querySelector("form").addEventListener("submit", event => {
    event.preventDefault();
    let nick = document.querySelector("#nick").value;
    let message = document.querySelector("#message").value;
    connection.send(nick + ":" + message);
    document.querySelector("#message").value = "";
});`;
	
	res.status(200).send(respStr);
});

// Set up a headless websocket server that prints any
// events that come in.
const wsServer = new ws.Server({ noServer: true });

var client_cnt = 0;

wsServer.on('connection', socket => {
    console.log('New Client Joining...');
        
    client_cnt = 0;
    wsServer.clients.forEach(client => {
        client_cnt++;
    });
    console.log('number of clients: ' + client_cnt);

    socket.on('message', message => {
        console.log('Received:' + message);
        var is_cmd = false;
        var parts = message.split(':');
        if (parts.length > 1) {
            console.log('parts: ' + JSON.stringify(parts,null,2));
            if (parts.length > 2) {
                if (parts[1] == "cmd") {
                    console.log('Is Command');
                    is_cmd = true;
                    switch (parts[2]) {
                        case "getnick":
                            console.log('GetNick!!');
                            break;
                        case "setnick":
                            if (parts.length > 3) {
                                console.log('SetNick: ' + parts[3]);
                                // Do the nickname setting logic
                            } else {
                                console.log('SetNick: ' + 'needs a nickname.');
                            }
                            break;
                        default:
                            console.log('Default!!');
                    }                    
                } else {
                    console.log('Not Command');
                }
            } else {
                console.log('Not Command');
            }
        } else {
            console.log('Malformed Message');
        }
        if (!is_cmd) {
            broadcast(message);
        }
    });
    
    socket.on('close', function close() {
        console.log('Disconnected...');
        client_cnt = 0;
        wsServer.clients.forEach(client => {
            client_cnt++;
        });
        console.log('number of clients: ' + client_cnt);    
    });
    
});

wsServer.on('error', error => {
    console.log('Server Error...' + error);
});

function broadcast(data) {

    var idx = 1;
    wsServer.clients.forEach(client => {
        // console.log("client: " + JSON.stringify(client, null, 2));
        // console.log("client: " + idx);

        if (client.readyState === ws.OPEN) {
            client.send(data);
        }
        idx++;
    });
}
  
let myVar = setInterval(myTimer, (30 * 1000));
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