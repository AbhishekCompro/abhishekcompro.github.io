var express   =     require("express");
var bodyParser  =    require("body-parser");
var app       =     express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/static'));

app.listen(3000,function(){
  console.log("Started on PORT 3000");
});

app.get('/',function(req,res){
  res.sendfile("index.html");
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
  res.sendfile("index.html");
  var xmldata=req.body.xmldata;
  console.log("inside test run " + xmldata);
  //res.end("yes. " + "xml: "+req.query.xml+" java: "+req.query.java);
});

app.get('/renderContent',function(req,res){
  console.log("inside render content");
  res.end("yes.");
});


app.get('/launchTest',function(req,res){
  console.log("inside launchtest");
  res.end("yes.");
});

app.get('/killTest',function(req,res){
  console.log("inside killtest");
  res.end("yes.");
});

app.get('/generateTestFiles',function(req,res){
  console.log("inside generate files");
  res.end("yes.");
});

app.get('/generateFiles',function(req,res){
  console.log("inside generate files");
  res.end("yes.");
});

app.get('/commitToSvn',function(req,res){
  console.log("inside commitToSvn");
  res.end("yes.");
});

