var express = require('express');
var app = express();

var port = process.env.PORT || 5000;

app.get('/new/:url*', function(req, res){
  console.log(req.originalUrl);
})

app.listen(port, function(){
  console.log('Server is on...');
});
