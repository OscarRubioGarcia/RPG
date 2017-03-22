var express = require('express'),
    server = express.createServer();

var http = require('http').Server(server);

server.use('/frameworks', express.static(__dirname + '/frameworks') );
server.use('/src', express.static(__dirname + '/src') );
server.use('/res', express.static(__dirname + '/res') );
server.use('/main.js', express.static(__dirname + '/main.js') );
server.use('/project.json', express.static(__dirname + '/project.json') );

server.get('/', function(req,res){
    res.sendfile(__dirname + '/index.html');
    console.log('Sent index.html');
});

server.get('/api/hello', function(req,res){
   res.send('Hello Cruel World');
});
server.listen(process.env.PORT || 3000);