var express = require('express');
var app = express();

app.get('/new/:url*', function(req, res){
  console.log(req.originalUrl);
})

app.listen('5000', function(){
  console.log('Server is on...');
});
