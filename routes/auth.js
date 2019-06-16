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
    //TODO:
   var user = JSON.parse(mycrypto.decrypt("KKF2QT4fwpMeJf36POk6yJVHTAEPAPMY", req.body.hashed_string));
       req.body.email = user.email;
       req.body.pwd = user.pwd;
       next();
   },
   function(req, res, next){
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.send(404, "Not Found"); }
      var token = jwt.sign(user, "makefrommiya",{ expiresIn:'12h'});
      return res.send(200, {"token": token})

    })(req, res, next);

  });
  return router;
}
