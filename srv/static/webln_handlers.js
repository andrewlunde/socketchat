function testLN01() {
    const d = new Date();
    document.getElementById("webln").innerHTML = d.toLocaleTimeString();
};

// const webln = require('webln');
//const requestProvider = WebLN.requestProvider();
// import { requestProvider } from 'webln';

async function asyncLN02(req, res) {
    document.getElementById("webln").innerHTML = "Starting...";
    try {
        const webln = await WebLN.requestProvider();
        document.getElementById("webln").innerHTML = "Got reqProv...";
        const info = await webln.getInfo();
        console.log("Info.alias: " + info.node.alias);
        console.log("Info.color: " + info.node.color);
        console.log("Info.pubkey: " + info.node.pubkey);
        document.getElementById("webln").innerHTML = "Got Infov...";
      }
      catch(err) {
        // Tell the user what went wrong
        console.log(err.message);
    }
};

function testLN02() {
    document.getElementById("webln").innerHTML = "TestLN02";
    asyncLN02(null, null);
};

async function asyncLN03(req, res) {
    document.getElementById("webln").innerHTML = "Starting...";
    try {
        const webln = await WebLN.requestProvider();
        document.getElementById("webln").innerHTML = "Got reqProv...";
        let nick = document.querySelector("#nick").value;
        const invoice = await webln.makeInvoice({"amount":17, "defaultMemo":"Test Invoice from " + nick});
        console.log("Invoice: " + invoice.paymentRequest);
        document.getElementById("webln").innerHTML = "Make Invoice.";
        connection.send(nick + ":INV:" + invoice.paymentRequest);
        document.getElementById("webln").innerHTML = "Sent Invoice.";
      }
      catch(err) {
        // Tell the user what went wrong
        console.log(err.message);
    }
};

function testLN03() {
    document.getElementById("webln").innerHTML = "TestLN03";
    asyncLN03(null, null);
};

async function asyncLN04(req, res) {
    document.getElementById("webln").innerHTML = "Starting...";
    try {
        const webln = await WebLN.requestProvider();
        document.getElementById("webln").innerHTML = "Got reqProv...";
        let nick = document.querySelector("#nick").value;
        let invoice = document.getElementById("invoice").innerHTML;
        if (invoice.length > 0) {
            document.getElementById("webln").innerHTML = "Send Payment.";
            const preimage = await webln.sendPayment(invoice);
            console.log("PreImage: " + preimage);
        } else {
            document.getElementById("webln").innerHTML = "No Invoice Yet.";
        }
      }
      catch(err) {
        // Tell the user what went wrong
        console.log(err.message);
        document.getElementById("webln").innerHTML = err.message;
    }
};

function testLN04() {
    document.getElementById("webln").innerHTML = "TestLN04";
    asyncLN04(null, null);
};