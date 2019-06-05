var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
const session = require('express-session');

var jwt = require('jsonwebtoken');

var mongo = require("../lib/database");



  router.get('/login', function (request, res, next) {
    res.render('login', { session:request.session });
  });

  router.post('/login', function(request, res, next){
    var user_db = mongo.UserDB();
    var usercursur = user_db.find({
      email: request.body.email,
      pwd: request.body.pwd
    })
    .toArray(function(err, result){
      if(result.length == 0){
        console.log("not found");
        res.send(404)
      }else{
        var user = { id: request.body.email };
        var token = jwt.sign(user, 'TEAM_HAPPY');
      
        res.send({"endpoint": "/users", "token": token});
      }
    })

  });

  router.get('/signup', function (request, res, next) {

    res.render('signup', { session:request.session });
  });

  router.post('/signup', function (request, res, next) {
    //TODO: phone number generator,
    var phone_number = "070123456"
    var myobj = { "_id": phone_number, "email": request.body.email, "pwd":request.body.pwd, "phone": phone_number, "ip":"0.0.0.0"}

    var user_db = mongo.UserDB();
    var allinventory = user_db.find({}).toArray(function(err, result){
      console.log(result);
    })
    user_db.insertOne(myobj, function(err, result){
      if(err) throw err;
      console.log("inserted");
      res.redirect('/')
    })
  });

  module.exports = router;
