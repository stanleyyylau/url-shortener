var express = require('express');
var router = express.Router();
var Url = require('./models').Url;
var urlEncode = require('./urlEncode');
var config = require('./config');

router.get('/:url*', function(req, res, next){
  var splitedStrArray = req.originalUrl.split('new/');
  var requestdUrl = splitedStrArray[1];
  var regPatt = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
  //above pattern is from the internet
  console.log(requestdUrl);
  if(regPatt.test(requestdUrl)){
    console.log('requested url is valid url');
    var shortUrl = '';
    Url.findOne({original_url:requestdUrl},function(err,doc){
        //if the url not already in database
        if(err) return console.log(err);
        else{
          if(doc){
            res.json(doc);
          }else {
            console.log("url not exited in db yet, you need to add it");
            var newUrl = new Url({
              original_url: requestdUrl,
            });
            newUrl.save(function(err, doc){
              if(err) return console.log(err);
              console.log('newUrl save done!!! about to add short url to it');
              var tempid = doc._id;
              console.log(tempid);
              var query = {'original_url': requestdUrl};
              var updates = {short_url: config.webhost + urlEncode.encode(tempid)};
              Url.findOneAndUpdate(query, updates, function(err, docs){
                if(err) return console.log(err);
                console.log("short_url added done");
                Url.findOne({original_url: requestdUrl},function(err, docdoc){
                  if(err) return console.log(err);
                  res.json(docdoc);
                })
              })
            })
          }
        }

    })


  }else {
    console.log('invalid url')
    res.json({"error":"invalid URL address"});
  }
});


//code below handles the re direction part
router.get('/:id', function(req, res){
  var ShortLink = config.webhost + req.params.id;
  console.log(ShortLink);
})



module.exports = router;
