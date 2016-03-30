var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var _localSrcBasepath = '';
//var _localSrcBasepath = 'S:\\sims-2016-svn\\sim5office16\\src';
var _taskXmlPath = '';  // \\SKL16\\AC\\02\\01.08.T1
var _appName = '';  // access


var fs = require('fs');
var path = require('path');

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
  console.log("Launch url http://localhost in browser to configure");

  try{
   var srcPath = db.getData("/srcPath");
    _localSrcBasepath = srcPath;
  }catch(err){
    //console.log(err)
  }
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


app.get('/commit',function(req,res){
  res.sendfile("index-commit.html");
  console.log("xml: "+req.query.xml+" java: "+req.query.java);
  //res.end("yes. " + "xml: "+req.query.xml+" java: "+req.query.java);
});

app.post('/commit',function(req,res){

  var xmldata = req.body.distXML;
  console.log("inside commit " + xmldata);

  var javadata = req.body.distJava;
  console.log("inside commit " + javadata);

  var xmlDistFilename = req.body.xmlFilename;
  var javaDistFilename = req.body.javaFilename;
  var appName = req.body.appName;

  console.log("inside commit xmlFilename " + xmlDistFilename);
  console.log("inside commit javaFilename " + javaDistFilename);
  try{
    db.push("/xmlDist",xmldata,false);
    db.push("/javaDist",javadata,false);
    db.push("/xmlDistFilename",xmlDistFilename,false);
    db.push("/javaDistFilename",javaDistFilename,false);
    db.push("/appName",appName,false);
    _appName = appName;
  }catch(err){
    console.log('error in db push: ' + err)
  }

  _taskXmlPath = getDirFromXMlName(xmlDistFilename);

  updateTaskList(_appName,javaDistFilename.replace('.java',''));
  updatePom(_appName);

  res.sendfile("index-commit.html");
  console.log("xml: "+req.query.xml+" java: "+req.query.java);
});


app.get('/testrun',function(req,res){
  res.sendfile("index-run.html");
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

  var appName = req.body.appName;
  console.log("inside test run xmlFilename " + xmlFilename);
  console.log("inside test run javaFilename " + javaFilename);
try{
  db.push("/xmldata",xmldata,false);
  db.push("/javadata",javadata,false);
  db.push("/xmlFilename",xmlFilename,false);
  db.push("/javaFilename",javaFilename,false);
  db.push("/appName",appName,false);
  _appName = appName;
}catch(err){
  console.log('error in db push: ' + err)
}

  _taskXmlPath = getDirFromXMlName(xmlFilename);

  updateTaskList(_appName,javaFilename.replace('.java',''));
  updatePom(_appName);

  res.sendfile("index-run.html");

});

app.get('/renderContent',function(req,res){
  console.log("inside render content");
  var xmldata ='';
  var javadata ='';
  var xmlFilename ='' ;
  var javaFilename ='';
  var appName='';

try{
  xmldata = db.getData("/xmldata");
  javadata = db.getData("/javadata");
  xmlFilename = db.getData("/xmlFilename");
  javaFilename = db.getData("/javaFilename");
  appName = db.getData("/appName");

}catch(err){
  console.log(err)
}
  res.send({xmldata:xmldata,javadata:javadata,xmlFilename:xmlFilename,javaFilename:javaFilename});
  res.end();
});

app.get('/renderContentDist',function(req,res){
  console.log("inside render content");
  var xmlDist ='';
  var javaDist ='';
  var xmlDistFilename ='' ;
  var javaDistFilename ='';
  try{
    xmlDist = db.getData("/xmlDist");
    javaDist = db.getData("/javaDist");
    xmlDistFilename = db.getData("/xmlDistFilename");
    javaDistFilename = db.getData("/javaDistFilename");

  }catch(err){
    console.log(err)
  }
  res.send({xmlDist:xmlDist,javaDist:javaDist,xmlDistFilename:xmlDistFilename,javaDistFilename:javaDistFilename});
  res.end();
});


app.get('/launchTest',function(req,res){
  console.log("inside launchtest");
/*  exec('runTest.bat', function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });*/

  var options = { cwd: _localSrcBasepath.replace('src',''),
    env: process.env
  }

  ls = process.spawn('cmd.exe', ['/c', 'mvn test'], options);



  ls.stdout.on('data', function(data){
    //console.log('tt')
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

app.get('/generateTestFilesDist',function(req,res){
  console.log("inside generate files");

  var xmlDist ='';
  var javaDist ='';
  var xmlDistFilename ='' ;
  var javaDistFilename ='';
  try{
    xmlDist = db.getData("/xmlDist");
    javaDist = db.getData("/javaDist");
    xmlDistFilename = db.getData("/xmlDistFilename");
    javaDistFilename = db.getData("/javaDistFilename");

  }catch(err){
    console.log(err)
  }


  var xmlbasepath = _localSrcBasepath +"\\test\\resources\\taskXML"+_taskXmlPath+"\\"+xmlDistFilename;
  var javabasepath = _localSrcBasepath +"\\test\\java\\sims\\testcase\\"+_appName+"\\"+javaDistFilename;


  var dir = _localSrcBasepath +"\\test\\resources\\taskXML"+_taskXmlPath+"\\";

  if (!fs.existsSync(dir)){
    //fs.mkdirSync(dir);
    fs.mkdirParent(dir, function(){

      fs.writeFile(xmlbasepath, xmlDist, function(error) {
        if (error) {
          console.error("write error:  " + error.message);
        } else {
          console.log("Successful Write to " + xmlbasepath);
        }
      });

      fs.writeFile(javabasepath, javaDist, function(error) {
        if (error) {
          console.error("write error:  " + error.message);
        } else {
          console.log("Successful Write to " + javabasepath);
        }
      });


    });
  }
  else{

    fs.writeFile(xmlbasepath, xmlDist, function(error) {
      if (error) {
        console.error("write error:  " + error.message);
      } else {
        console.log("Successful Write to " + xmlbasepath);
      }
    });

    fs.writeFile(javabasepath, javaDist, function(error) {
      if (error) {
        console.error("write error:  " + error.message);
      } else {
        console.log("Successful Write to " + javabasepath);
      }
    });
  }

  res.end("file write success.");
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

  var xmlbasepath = _localSrcBasepath +"\\test\\resources\\taskXML"+_taskXmlPath+"\\"+xmlFilename;
  var javabasepath = _localSrcBasepath +"\\test\\java\\sims\\testcase\\"+_appName+"\\"+javaFilename;

  var dir = _localSrcBasepath +"\\test\\resources\\taskXML"+_taskXmlPath+"\\";

  if (!fs.existsSync(dir)){
    //fs.mkdirSync(dir);
    fs.mkdirParent(dir,function(){
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

    });
  }
  else{
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
  }



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

var getDirFromXMlName = function(taskXMLName){

  var folderNames = taskXMLName.split("_");

  if(folderNames.length == 6)
  {
    var dirName = "";
    dirName = "//" + folderNames[0] + "//" + folderNames[1] + "//" + folderNames[2] + "//";
    var tmpFolderName = folderNames[0] + "_" + folderNames[1] + "_" + folderNames[2] + "_";
    dirName = dirName + taskXMLName.replace(new RegExp(tmpFolderName, 'g'), '').replace(new RegExp('_', 'g'), '.').replace(new RegExp('.xml', 'g'), '');

    console.log('dirName: ' + dirName);
    return dirName;

  }
  else {
    return null;
  }
};



function updateTaskList(appName, javaClassName) {

  var appData ='<'+appName+' practice="off">  <task>sims.testcase.'+appName+'.'+javaClassName+'</task> </'+appName+'>';

   var content;
// First I want to read the file
  fs.readFile('./tasklist.xml',encoding='utf8', function read(err, data) {
    if (err) {
      throw err;
    }
    content = data;

    // Invoke the next step here however you like
    content = content.replace('##customData##',appData);

    fs.writeFile(_localSrcBasepath +"\\test\\resources\\tasklist.xml", content, function(error) {
      if (error) {
        console.error("write error:  " + error.message);
      } else {
        console.log("Successful Write to " + _localSrcBasepath +"\\test\\resources\\tasklist.xml");
      }
    });

  });

};

function updatePom(appName) {

  var appData ='<suiteXmlFile>src/test/java/sims/testsuite/testng_'+appName+'.xml</suiteXmlFile>';

  var content;
// First I want to read the file
  fs.readFile(_localSrcBasepath.replace('src','')+"pom.xml",encoding='utf8', function read(err, data) {
    if (err) {
      throw err;
    }
    content = data;

    // Invoke the next step here however you like
    content = content.replace( /<suiteXmlFile(.*)suiteXmlFile>/g ,appData);

    fs.writeFile(_localSrcBasepath.replace('src','')+"pom.xml", content, function(error) {
      if (error) {
        console.error("write error:  " + error.message);
      } else {
        console.log("Successful Write to " + _localSrcBasepath +"\\test\\resources\\tasklist.xml");
      }
    });

  });

};

app.get('/getSrcPath',function(req,res){
  console.log("inside getSrcPath");
  var srcPath ='';
  try{
    srcPath = db.getData("/srcPath");

  }catch(err){
    console.log(err)
  }
  res.send({srcPath:srcPath});
  res.end();
});

app.post('/setSrcPath',function(req,res){
  var srcPath=req.body.srcPath;
  try{
    _localSrcBasepath = srcPath;
    db.push("/srcPath",srcPath,false);
  }catch(err){
    console.log('error in db push: ' + err)
  }
});


fs.mkdirParent = function(dirPath, callback) {
  //Call the standard fs.mkdir
  var mode = null;
  fs.mkdir(dirPath, mode, function(error) {
    //When it fail in this way, do the custom steps
    if (error && error.errno === 34) {
      //Create all the parents recursively
      fs.mkdirParent(path.dirname(dirPath), mode, callback);
      //And then the directory
      fs.mkdirParent(dirPath, mode, callback);
    }
    //Manually run the callback since we used our own callback to do all these
    setTimeout(function(){ callback && callback(error); }, 3000);


  });
};