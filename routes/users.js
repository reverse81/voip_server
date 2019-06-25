var express = require('express');
var router = express.Router();

var mongo = require("../data/database");
var cryptoData = require("../data/dataCrypto");
var numGen = require('../lib/numGenerator')
/* GET users listing. */

module.exports = function (passport) {
  router.get('/', function(req, res, next) {
    res.render('users', { title: 'User Management' });
  });

  router.get('/all',checkPermission("all"),
  function(req, res, next){
      cryptoData.allUser().then(function(data){
        if(data){
          data.toArray(function(err, result){
            res.send(200, result);
          });
        }else{
          res.send(400, "empty")
        }

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
              return res.send(404, "Unauthorized");
            }
          });
      }
  }

  function getip(req,res){
    cryptoData.findUser({phone:req.body.phone}).then(function(data){
      if(data){
        res.send(200, {ip:data.ip});
      }else{
        res.send(400, "not exist")
      }

    });

  }

  router.get('/ip', checkPermission("all"), getip);

  function saveip(req, res){
    cryptoData.findUserIP({ip:req.body.ip}).then(function(data){
      if(data !== null){
        cryptoData.updateUserInfo({email:data.email}, {ip:"0.0.0.0"}).then(function(data){
          cryptoData.updateUserInfo({email:req.user.email}, {ip:req.body.ip}).then(function(data){
            res.send(200, {result:"success"})
          })
        })
      }else{
        cryptoData.updateUserInfo({email:req.user.email}, {ip:req.body.ip}).then(function(data){
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
              phone: "080"+ numGen.makeNumber(3)+ numGen.leftPadWithZeros(next_id,4),
              ip: "0.0.0.0",
              permission: "users",
              status: "enable"};

            cryptoData.saveUser(myobj).then(function(data){
              res.send(200, {phone:myobj.phone})
            })
          });

      }else{
        res.send(400, "User duplicated.");
      }
    });
  });

  router.post("/recovery", function(req, res, next){

    var email = require('../lib/email')
    var newPwd = numGen.password_generator(12);
    var database = require("../data/database")
    //TODO: phone_number, email adress check
    if(true){
      cryptoData.findUser({email:req.body.email, phone:req.body.phone}).then(function(data){
        // email.sendMail(req.body.email, newPwd);

        myobj = {
          email:req.body.email,
          pwd:newPwd
        }
        cryptoData.updatePwd({email:req.body.email}, newPwd).then(function(data){
          if(data){
            console.log(data.result);
            res.send(200, myobj)
          }else{
            res.send(400, {result:"Error"})
          }

        })
      });
    }
  });


  router.post("/update", checkPermission("all"), function(req, res, next){
    if(req.user.email == req.body.email){
      cryptoData.updateUserInfo({email:req.body.email}, {email:req.body.email, pwd:req.body.pwd}).then(function(data){
          console.log("update: ", data.result);
            res.send(200, {result:"ip update success"})
      })
    }else{
      res.send(404, {result:"not authorized"})
    }
  });


  router.post("/updateStatus", checkPermission("admin"), function(req, res, next){
    cryptoData.updateUserInfo({phone:req.body.phone}, {status:req.body.status}).then(function(data){
      // console.log("update: ", data.result);
      res.send(200, {result:"status update success"})
    })
  });


  router.post("/delete", checkPermission("admin"), function(req, res, next){
    const database = require("../data/database")
    console.log("deleteeeeeee");
    database.deleteUser({phone:req.body.phone}).then(function(data){
      console.log(data.result);
      res.send(200, data.result)
    })
  });

  return router;
}
