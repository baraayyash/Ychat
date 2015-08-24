// server.js

var express = require("express"), // Include express.
    twilio = require("twilio"); // Include twilio.

var app = express(); // Initialize express.

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods"," POST, GET, PUT, DELETE, OPTIONS,PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(__dirname + '/app')); // Serve files from the /app directory.


// Get a Twilio capability token.
app.get("/twilio/token", function (req, res) {
  res.header('Access-Control-Allow-Origin', "*");

  var capability = new twilio.Capability( // Create a Twilio capability token.
    'AC7fc03a747bdefc744fba1c0639e397c2',
    'fd4fdf4149f2fbe4bb52fd409fdd4fd1'
  );



  // Set the capability token to allow the client to make outbound calls.
  capability.allowClientOutgoing('APc255467ee9fa0cfe1a98e93d2c82f10e');
  capability.allowClientIncoming('jenny');
  // Send the token to the client.
  res.send(capability.generate());
});

// Fire up the server and start listening!
app.listen(3000, function () {
  console.dir("Express server started on port 3000.");
});