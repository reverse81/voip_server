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
var mycrypto = require("../lib/cryptoAlgorithms");

module.exports = function (passport) {
  router.get('/login', function (request, res, next) {
    res.render('login', { session:request.session });
  });

  router.post('/login',
  function(req, res, next){
   var user = JSON.parse(mycrypto.decrypt("KKF2QT4fwpMeJf36POk6yJVHTAEPAPMY", req.body.hashed_string));
       req.email = user.email;
       req.pwd = user.pwd;
       next();
   },
   function(req, res, next){
    var usercursur = database.findUser({
      email: req.email,
      pwd: req.pwd
    }).then(function(data){
      if(data !== null){
        var message = { id: req.email, permission: data.permission, message: "it makes from miya"};
        console.log("message", message);
        var token = jwt.sign(message, "makefrommiya",{ expiresIn:'12h'});
        res.send({"token": token});
      }else{
        console.log("login error");
        res.send("Login Error")
      }
    })
  });
  return router;
}
