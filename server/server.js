var express   =     require("express");
var bodyParser  =    require("body-parser");
var app       =     express();
var JsonDB = require('node-json-db');
var db = new JsonDB("myDataBase", true, true);
var fs = require("fs");

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
  res.end("yes.");
});

app.get('/killTest',function(req,res){
  console.log("inside killtest");
  res.end("yes.");
});

app.get('/generateTestFiles',function(req,res){
  console.log("inside generate files");

  var path = "s:\\Test.txt";
  var data = "Hello from the Node writeFile method! 2";

  fs.writeFile(path, data, function(error) {
    if (error) {
      console.error("write error:  " + error.message);
    } else {
      console.log("Successful Write to " + path);
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

