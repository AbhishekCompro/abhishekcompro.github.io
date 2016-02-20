var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


var fs = require('fs');

var JsonDB = require('node-json-db');
var db = new JsonDB("myDataBase", true, true);
var fs = require("fs");

//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(require('connect').bodyParser());
app.use(express.bodyParser());

/*app.use(bodyParser.urlencoded());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));*/

app.use(express.static(__dirname + '/static'));

var exec = require('child_process').exec;

var process = require('child_process');
var ls;
        var ab2str = function ab2str(buf) {
 return String.fromCharCode.apply(null, new Uint16Array(buf));
 };

server.listen(80,function(){
  console.log("Started on PORT 80");
});

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
      function (err, data) {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading index.html');
        }

        res.writeHead(200);
        res.end(data);
      });
}

io.on('connection', function (socket) {
  //socket.emit('news', { hello: 'world' });
/*  socket.on('my other event', function (data) {
    console.log(data);
  });*/
});

function rnd() {
  var num=Math.floor(Math.random()*1000);
  return num;
}

//https://ricochen.wordpress.com/2011/10/14/learning-node-js-socket-io-a-simple-streaming-example/
io.sockets.on('connection', function (socket) {
  //t=setInterval( function() {
  //  console.log('in');
    var n=rnd();
  //socket.emit('stream', { hello: 'world' });
  //  io.emit('stream', {n:'Launch test to continue..'});
    //io.emit('stream', {n:'Launch test to continue.. 2'});
    //socket.send({n:'test'});
  //}, 4000);

/*  socket.on('action', function (data) {
    console.log('received action');
    if(data.todo=='stop') {
      socket.broadcast.emit('stream', {n:'Stopped'});
      console.log('stopping timer now.');
      clearInterval(t);
    } else if(data.todo='run') {
      // the setInterval code definitely can
      // be combined/optimized with the one above
      // again for DEMO's sake I just leave it as is
      t=setInterval( function() {
        var n=rnd();
        socket.broadcast.emit('stream', {n:n.toString()});
      }, 4000);
    }
  });*/
});



app.get('/',function(req,res){
  res.sendfile("index.html");
  console.log("xml: "+req.query.xml+" java: "+req.query.java);
});

app.post('/login',function(req,res){
  var user_name=req.body.user;
  var password=req.body.password;
  console.log("From Client pOST request: User name = "+user_name+" and password is "+password);
  res.end("yes");
});

app.get('/testrun',function(req,res){
  res.sendfile("index.html");
  console.log("xml: "+req.query.xml+" java: "+req.query.java);
  //res.end("yes. " + "xml: "+req.query.xml+" java: "+req.query.java);
});

app.post('/testrun',function(req,res){
  var xmldata=req.body.xmldata;
  console.log("inside test run " + xmldata);

  var javadata=req.body.javadata;
  console.log("inside test run " + javadata);

  var xmlFilename = req.body.xmlFilename;
  var javaFilename = req.body.javaFilename;
  console.log("inside test run xmlFilename " + xmlFilename);
  console.log("inside test run javaFilename " + javaFilename);
try{
  db.push("/xmldata",xmldata,false);
  db.push("/javadata",javadata,false);
  db.push("/xmlFilename",xmlFilename,false);
  db.push("/javaFilename",javaFilename,false);
}catch(err){
  console.log('error in db push: ' + err)
}

  res.sendfile("index.html");

});

app.get('/renderContent',function(req,res){
  console.log("inside render content");
  var xmldata ='';
  var javadata ='';
  var xmlFilename ='' ;
  var javaFilename ='';
try{
  xmldata = db.getData("/xmldata");
  javadata = db.getData("/javadata");
  xmlFilename = db.getData("/xmlFilename");
  javaFilename = db.getData("/javaFilename");

}catch(err){
  console.log(err)
}
  res.send({xmldata:xmldata,javadata:javadata,xmlFilename:xmlFilename,javaFilename:javaFilename});
  res.end();
});


app.get('/launchTest',function(req,res){
  console.log("inside launchtest");
  exec('runTest.bat', function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });

  ls = process.spawn('runTest.bat');

  ls.stdout.on('data', function(data){
    console.log('tt')
    io.emit('stream', {n:ab2str(data)});
    //io.sockets.on('connection', function (socket) {
    //io.sockets.broadcast.emit('stream', {n:data});
    //});

    console.log('stdout: ');
  })

  ls.stderr.on('data', function (data) {
    io.emit('stream', {n:ab2str(data)});

    console.log('stderr: ' + data);
  });

  ls.on('exit', function (code) {
    io.emit('stream', {n:ab2str(code)});

    console.log('child process exited with code ' + code);
  });

  res.end("yes.");
});

/*setInterval(function() {
  socket.emit('news', { hello: 'world2' });
}, 5000);*/

app.get('/killTest',function(req,res){
  console.log("inside killtest");
  //ls.kill();
  exec('taskkill /im chromedriver.exe /f', function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    console.log('test stopped.')

    io.emit('stream', {n:'Test stopped.'});
  });

  res.end("yes.");
});

app.get('/generateTestFiles',function(req,res){
  console.log("inside generate files");

  var xmldata ='';
  var javadata ='';
  var xmlFilename ='' ;
  var javaFilename ='';
  try{
    xmldata = db.getData("/xmldata");
    javadata = db.getData("/javadata");
    xmlFilename = db.getData("/xmlFilename");
    javaFilename = db.getData("/javaFilename");

  }catch(err){
    console.log(err)
  }

  var xmlbasepath = "S:\\sims-2016-svn\\sim5office16\\src\\test\\resources\\taskXML\\SKL16\\AC\\02\\01.08.T1\\"+xmlFilename;
  var javabasepath = "S:\\sims-2016-svn\\sim5office16\\src\\test\\java\\sims\\testcase\\access\\"+javaFilename;

  fs.writeFile(xmlbasepath, xmldata, function(error) {
    if (error) {
      console.error("write error:  " + error.message);
    } else {
      console.log("Successful Write to " + xmlbasepath);
    }
  });

  fs.writeFile(javabasepath, javadata, function(error) {
    if (error) {
      console.error("write error:  " + error.message);
    } else {
      console.log("Successful Write to " + javabasepath);
    }
  });

  res.end("file write success.");
});

app.get('/generateFiles',function(req,res){
  console.log("inside generate files");
  res.end("yes.");
});

app.get('/commitToSvn',function(req,res){
  console.log("inside commitToSvn");
  res.end("yes.");
});

