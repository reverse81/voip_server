var express = require('express');
var router = express.Router();

var mongo = require("../lib/database");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users', { title: 'User Management' });
});

router.get('/all', function(req, res, next){
  user_db = mongo.UserDB();
  var users = user_db.find({}).toArray(function(err, result){
    console.log(result);
    res.send(result);
  })
});

router.get('/ip', function(req, res, next){
  res.send("ip adress")
});

router.get('/ip', function(req, res, next){
  res.send("ip adress")
});


router.post('/schedules', function(req, res, next){
  res.send("schedules")
});


module.exports = router;
