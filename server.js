var express = require('express');
var app = express();
var routes = require('./routes.js');

var Url = require('./models').Url;
var urlEncode = require('./urlEncode');
var config = require('./config');

var Url = require('./models').Url;

var port = process.env.PORT || 5000;


var mongoose = require('mongoose');
mongoose.connect('mongodb://stanley:stanley@ds029456.mlab.com:29456/urlapp')

var db = mongoose.connection;

db.on("error", function(err){
	console.error("connection error:", err);
});

db.once("open", function(){
	console.log("db connection successful");
});

app.use(express.static('public'));

app.use('/new', routes);


//code below handles the re direction part
app.get('/:id', function(req, res){
  var ShortLink = config.webhost + req.params.id;
  console.log(ShortLink);
  Url.findOne({short_url: ShortLink},function(err, doc){
    if(err) return console.log(err);
    if(doc){
      var originalLink = doc.original_url;
      console.log(originalLink);
      res.redirect(originalLink);
    }
  })
})

app.get('/', function(req, res){
  res.send(index.html);
})


// catch 404 and forward to error handler
app.use(function(req, res, next){
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// Error Handler

app.use(function(err, req, res, next){
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message
		}
	});
});


app.listen(port, function(){
  console.log('Server is on...', port);
});
