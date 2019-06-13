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

  router.post('/login', function(request, res, next){
    var user = mycrypto.decrypt("KKF2QT4fwpMeJf36POk6yJVHTAEPAPMY", request.body.hashed_string);
    // console.log(typeof request.body.hashed_string);
    user = JSON.parse(user);
    var usercursur = database.findUser({
      email: user.email,
      pwd: user.pwd
    }).then(function(data){

      if(data !== null){
        var message = { id: user.email, permission: data.permission, message: "it makes from miya"};
        console.log("message", message);
        var token = jwt.sign(message, "makefrommiya");
      
        res.send({"token": token});
      }else{
        console.log("login error");
        res.send("Login Error")
      }
    })
  });
  return router;
}

//
// router.post('/login', function(request, res, next){
//   console.log("crypto", mycrypto.decrypt("KKF2QT4fwpMeJf36POk6yJVHTAEPAPMY", request.body.hashed_string));
//   var usercursur = database.findUser({
//     email: request.body.email,
//     pwd: request.body.pwd
//   }).then(function(data){
//     console.log(data);
//     if(data !== null){
//       var user = { id: request.body.email };
//       var token = jwt.sign(user, privatekey);
//       console.log(token);
//       res.send({"token": token});
//     }else{
//       console.log("login error");
//       res.send("Login Error")
//     }
//   })
// });

// console.log(data);
  // module.exports = router;
