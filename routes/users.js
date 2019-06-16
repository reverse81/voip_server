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

  function checkPermission(permission) {
      return function(req,res,next) {
          return passport.authenticate('jwt',{ session: false })(req,res,function() {
            if(permission == req.user.permission){
                return next();
            }else if(permission == "all"){
              return next();
            }else{
              return res.send("Unauthorized");
            }
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
  router.get('/ip', checkPermission("all"), getip);

  function saveip(req, res){
    cryptoData.findUserIP({ip:req.body.ip}).then(function(data){
      if(data !== null){
        //같은 ip가 있음
        res.send("fail")
      }else{
        //같은 ip가 없음.
        res.send("success")
      }

    });

  }
  router.post('/ip', checkPermission("all"), saveip);

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


  router.post("/recovery", checkPermission("all"), function(req, res, next){

  });


  router.post("/update", checkPermission("all"), function(req, res, next){
    
  });


  //TODO: user cant delete user info. permission check
  router.delete("/delete", checkPermission("admin"), function(req, res, next){

  });

  return router;
}
// module.exports = router;
