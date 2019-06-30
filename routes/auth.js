var express = require('express');
var router = express.Router();
const session = require('express-session');
var database = require('../data/dataCrypto')
require('dotenv').config();
var jwt = require('jsonwebtoken');
var privatekey = process.env.SECRET_KEY;
var mycrypto = require("../lib/cryptoAlgorithms");

module.exports = function (passport) {
  router.get('/login', function (request, res, next) {
    res.render('login', { session:request.session });
  });

  router.post('/login',
  function(req, res, next){
   var user = JSON.parse(mycrypto.decrypt(privatekey, req.body.hashed_string));
       req.body.email = user.email;
       req.body.pwd = user.pwd;
       next();
   },
   function(req, res, next){
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.send(404, "wrong email or password."); }
      if(user.status == "enable"){
        var token = jwt.sign(user, "makefrommiya",{ expiresIn:'72h'});
        return res.send(200, {"token": token, "phone":user.phone})
      }else{
        return res.send(400, {"error":"disabled user."})
      }

    })(req, res, next);

  });

  router.post('/login_admin',
    function(req, res, next){

      passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.send(404, "Not Found"); }
        console.log("admin login", user);
        var token = jwt.sign(user, "makefrommiya",{ expiresIn:'12h'});
        return res.send(200, {"token":token});
      })(req, res, next);
  })
  return router;
}
