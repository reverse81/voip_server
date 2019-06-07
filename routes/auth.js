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
        var token = jwt.sign(user, '');

        res.send({"endpoint": "/users", "token": token});
      }
    })

  });


  module.exports = router;
