var express = require('express');
var router = express.Router();

var mongo = require("../data/database");
var cryptoData = require("../data/dataCrypto");

/* GET users listing. */

module.exports = function (passport) {
  router.get('/', function(req, res, next) {
    res.render('users', { title: 'User Management' });
  });

  router.get('/all',
    passport.authenticate('jwt', {session:false}), function(req, res, next){
      cryptoData.allUser().then(function(data){
        data.toArray(function(err, result){
          console.log(result);
          res.send(result);
        });
      });
  });

  //TODO: permission check. user or admin
  function checkPermission(permission) {
      return function(req,res,next) {
          return passport.authenticate('jwt',{ session: false })(req,res,function() {
              return next();
          });
      }
  }


  function getip(req,res){
    cryptoData.findUser({email:req.user.email}).then(function(data){
      console.log(data);
      res.send(data.ip);
    });

  }
// passport.authenticate('jwt', {session:false})
  router.get('/ip', checkPermission("user"), getip);

  router.post('/ip', function(req, res, next){
    cryptoData.findUser({email:req.body.email}).then(function(data){
    });
  });

  router.get('/create', function (request, res, next) {
    res.render('signup', { session:request.session });
  });

  router.post("/create", function(req, res, next){
    var phone_number = Number(0701234567);
    cryptoData.findUser({email:req.body.email}).then(function(data){
      if(data == null){
          cryptoData.findUserId(data).then(function(next_id){
            var myobj = {
              _id: next_id,
              email: req.body.email,
              pwd:req.body.pwd,
              phone: phone_number+ parseInt(next_id),
              ip: "0.0.0.0",
              permission: "users",
              status: "enable"};

            cryptoData.saveUser(myobj).then(function(data){
              res.send(200, "success")
            })
          });

      }else{
        res.send("User duplicated.");
      }
    });
  });


  router.post("/recovery", function(req, res, next){

  });


  router.post("/update", passport.authenticate('jwt', {session:false}), function(req, res, next){
    // user_db.findOneAndUpdate(obj, function(err,doc) {
    //        if (err) { throw err; }
    //        else { console.log("Updated"); }
    //      });
  });


  //TODO: user cant delete user info. permission check
  router.delete("/delete", function(req, res, next){

  });

  return router;
}
// module.exports = router;
