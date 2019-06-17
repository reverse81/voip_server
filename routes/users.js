var express = require('express');
var router = express.Router();

var mongo = require("../data/database");
var cryptoData = require("../data/dataCrypto");

/* GET users listing. */

module.exports = function (passport) {
  router.get('/', function(req, res, next) {
    res.render('users', { title: 'User Management' });
  });

  router.get('/all',checkPermission("all"),
  function(req, res, next){
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
      res.send(200, {ip:data.ip});
    });

  }

  router.get('/ip', checkPermission("all"), getip);

  function saveip(req, res){
    cryptoData.findUserIP({ip:req.body.ip}).then(function(data){
      if(data !== null){
        cryptoData.updateUserIP({email:data.email}, {ip:"0.0.0.0"}).then(function(data){
          cryptoData.updateUserIP({email:req.user.email}, {ip:req.body.ip}).then(function(data){
            res.send(200, {result:"success"})
          })
        })
      }else{
        cryptoData.updateUserIP({email:req.user.email}, {ip:req.body.ip}).then(function(data){
          res.send(200, {result:"success"})
        })
      }
    });
  }
  router.post('/ip', checkPermission("all"), saveip);

  router.get('/create', function (request, res, next) {
    res.render('signup', { session:request.session });
  });

  router.post("/create", function(req, res, next){
    var phone_number = Number(1234567891);
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
              res.send(200, {phone:myobj.phone})
            })
          });

      }else{
        res.send("User duplicated.");
      }
    });
  });

  router.post("/recovery", function(req, res, next){
    var pwdGen = require('../lib/pwdgenerator')
    var email = require('../lib/email')
    var newPwd = pwdGen.password_generator(12);
    var database = require("../data/database")
    //TODO: phone_number, email adress check
    if(true){
      cryptoData.findUser({email:req.body.email, phone:parseInt(req.body.phone)}).then(function(data){
        // email.sendMail(req.body.email, newPwd);
        // res.send({phone: req.body.phone, new_pwd: newPwd});
        console.log("finddata: ", data);
        myobj = {
          email:req.body.email,
          pwd:newPwd
        }
        cryptoData.updatePwd({email:req.body.email}, newPwd).then(function(data){
          res.send(200, data)
        })
      });
    }
  });


  router.post("/update", checkPermission("all"), function(req, res, next){
    console.log("test");
    if(req.user.email == req.body.email){
      cryptoData.updateUserIP({email:req.body.email}, {email:req.body.email, pwd:req.body.pwd}).then(function(data){
          console.log("update: ", data.result);
            res.send(200, "success")
      })
    }else{
      res.send(404, "not authorized")
    }


  });


  //TODO: user cant delete user info. permission check
  router.post("/delete", checkPermission("admin"), function(req, res, next){
    res.send("success")
  });

  return router;
}
// module.exports = router;
