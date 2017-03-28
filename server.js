var fs = require("fs");
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var https = require('https');
var mkdirp = require('mkdirp');

/*
Setup for ssl.  Will need to find a way to generate a self-signed cert for
the server instance (Heroku) this gets deployed to
var options = {
   key  : fs.readFileSync('server.key'),
   cert : fs.readFileSync('server.crt')
};
 */

/*
Serve static content from the 'public' directory.
Need to figure out how to put the content there correctly...
 */
var contentDir = path.join(__dirname, 'public');
app.use('/', express.static(contentDir));
/*
Set up json processing
 */
app.use(bodyParser.json());

/*
And form parsing
 */
app.use(bodyParser.urlencoded({extended: true}));

/*
log all request bodies.
 */
app.use(function (req, res, next) {
  // console.log(req.body); // populated!
  next()
});

/*
Get configurations
 */
app.get('/configuration/*', function (req, res) {
  console.log('');
  console.log('-------------------------------------------------------');
  console.log('Requested Configuration: ' + __dirname + req.path);
  if (req.path == '/configuration/') {
    // Get the directory listing.
    fs.readdir( __dirname + req.path, function (err, files) {
      files = {
        "files": files
      };
      console.log('Configuration Files Found: ');
      console.log(JSON.stringify(files, null, 2));
      console.log('-------------------------------------------------------');
      console.log('');
      // Firefox will display error if this is missing
      res.setHeader("Content-Type", 'application/json');
      res.send( files );
      res.end();
    });
  }
  else {
    // Read a single file.
    fs.readFile( __dirname + req.path, function (err, data) {
      console.log('File Requested: ');
      console.log(JSON.stringify(JSON.parse(data), null, 2));
      console.log('-------------------------------------------------------');
      console.log('');
      // Firefox will display error if this is missing
      res.setHeader("Content-Type", 'application/json');
      res.end( data );
    });
  }
});

/*
 Save configurations
 */
app.post('/configuration/*', function(request, response){
  console.log('');
  console.log('-------------------------------------------------------');
  console.log('Saving configuration file: ');
  console.log(JSON.stringify(request.body, null, 2));      // your JSON
  mkdirp(__dirname + '/configuration', function(err) { 
    if (err) {
      console.log('Error: ');
      console.error(err);
      console.log('-------------------------------------------------------');
      console.log('');
      return err;
    }
  });

  var formattedToWrite = JSON.stringify(request.body, null, 4);
  fs.writeFile(__dirname + request.path, formattedToWrite, function(err) {
    if (err) {
      console.log('Error: ');
      console.error(err);
      console.log('-------------------------------------------------------');
      console.log('');
      return err;
    }
    console.log("The file was saved to " + __dirname + request.path);
    console.log('-------------------------------------------------------');
    console.log('');
  }); 
  response.send(request.body);    // echo the result back
});

/*
https.createServer(options, app).listen(443, function () {
   console.log('Started!');
});
*/

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
