var express = require('express'),
    server = express.createServer();

app.use('/frameworks', express.static(__dirname + '/frameworks') );
app.use('/src', express.static(__dirname + '/src') );
app.use('/res', express.static(__dirname + '/res') );
app.use('/main.js', express.static(__dirname + '/main.js') );
app.use('/project.json', express.static(__dirname + '/project.json') );

app.get('/', function(req,res){
    res.sendfile('index.html');
    console.log('Sent index.html');
});

app.get('/api/hello', function(req,res){
   res.send('Hello Cruel World');
});
app.listen(process.env.PORT || 3000);