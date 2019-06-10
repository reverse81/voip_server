var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
const session = require('express-session');
var database = require('../data/dataCrypto')
require('dotenv').config();
var jwt = require('jsonwebtoken');
var privatekey = process.SECRET_KEY;


router.get('/login', function (request, res, next) {
  res.render('login', { session:request.session });
});

router.post('/login', function(request, res, next){
  console.log("login");
  console.log(request.body);

  var usercursur = database.findUser({
    email: request.body.email,
    pwd: request.body.pwd
  }).then(function(data){
    console.log(data);
    if(data !== null){
      var user = { id: request.body.email };
      var token = jwt.sign(user, privatekey);
      console.log(token);
      res.send({"token": token});
    }else{
      console.log("login error");
      res.send("Login Error")
    }
  })
});


  module.exports = router;
