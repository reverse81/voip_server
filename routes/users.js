var express = require('express');
var router = express.Router();

var mongo = require("../data/database");
var cryptoData = require("../data/dataCrypto");
var numGen = require('../lib/numGenerator')
/* GET users listing. */

module.exports = function(passport) {
  router.get('/', function(req, res, next) {
    res.render('users', {title: 'User Management'});
  });

  router.get('/all', checkPermission("admin"), function(req, res, next) {
    cryptoData.allUser().then(function(data) {
      if (data) {
        data.toArray(function(err, result) {
          res.send(200, result);
        });
      } else {
        res.send(400, "empty")
      }

    });
  });

  function checkPermission(permission) {
    return function(req, res, next) {
      return passport.authenticate('jwt', {session: false})(req, res, function() {
        if (req.user.status == "enable") {
          if (permission == req.user.permission) {
            return next();
          } else if (permission == "all") {
            return next();
          } else {
            return res.send(404, {error: "Unauthorized"});
          }
        } else {
          return res.send(404, {error: "Unauthorized"});
        }
      });
    }
  }

  function getip(req, res) {
    cryptoData.findUser({phone: req.body.phone}).then(function(data) {
      if (data) {
        res.send(200, {ip: data.ip});
      } else {
        res.send(400, "not exist")
      }

    });

  }

  router.get('/ip', checkPermission("all"), getip);

  function saveip(req, res) {
    cryptoData.findUserIP({ip: req.body.ip}).then(function(data) {
      if (data !== null) {
        cryptoData.updateUserInfo({
          email: data.email
        }, {ip: "0.0.0.0"}).then(function(data) {
          cryptoData.updateUserInfo({
            email: req.user.email
          }, {ip: req.body.ip}).then(function(data) {
            res.send(200, {result: "success"})
          })
        })
      } else {
        cryptoData.updateUserInfo({
          email: req.user.email
        }, {ip: req.body.ip}).then(function(data) {
          res.send(200, {result: "success"})
        })
      }
    });
  }
  router.post('/ip', checkPermission("all"), saveip);

  router.get('/create', function(request, res, next) {
    res.render('signup', {session: request.session});
  });
  function validate_email(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function validate_pwd(pwd) {
    return pwd.length >= 8;
  }

  router.post("/create", function(req, res, next) {
    if (req.body.recovery != null && req.body.recovery.answer != null) {
      if (validate_email(req.body.email) == true && validate_pwd(req.body.pwd) == true) {
        cryptoData.findUser({email: req.body.email}).then(function(data) {
          if (data == null) {
            cryptoData.findUserId(data).then(function(next_id) {
              var myobj = {
                _id: next_id,
                email: req.body.email,
                pwd: req.body.pwd,
                phone: "080" + numGen.makeNumber(3) + numGen.leftPadWithZeros(next_id, 4),
                ip: "0.0.0.0",
                recovery: req.body.recovery,
                permission: "users",
                status: "enable"
              };

              cryptoData.saveUser(myobj).then(function(data) {
                res.send(200, {phone: myobj.phone})
              })
            });

          } else {
            res.send(400, "User duplicated.");
          }
        });
      } else {
        res.send(400, {error: "wrong email or passwrod."})
      }
    } else {
      res.send(400, {error: "You have to input recovery question and answer."})
    }
  });

  router.post("/recovery", function(req, res, next) {
    var email = require('../lib/email')
    var newPwd = numGen.password_generator(12);
    var database = require("../data/database")

    if (true) {
      cryptoData.findUser({email: req.body.email, phone: req.body.phone, recovery:req.body.recovery}).then(function(data) {
        console.log(data);
        if (data) {
          myobj = {
            email: req.body.email,
            pwd: newPwd
          }
          cryptoData.updatePwd({
            phone: req.body.phone
          }, newPwd).then(function(result) {
            if (result) {
              res.send(200, {newPassword: newPwd})
            } else {
              res.send(400, {error: "save error"})
            }

          })
        } else {
          res.send(400, {error: "user not founded."})
        }

      });
    }
  });

  router.post("/update", checkPermission("all"), function(req, res, next) {

    if (validate_email(req.body.email) && validate_pwd(req.body.new_pwd)) {
      var new_data = {}
      if (req.body.new_pwd != null) {
        new_data = {
          email: req.body.email,
          pwd: req.body.new_pwd
        }
      } else {
        new_data = {
          email: req.body.email
        }
      }
      cryptoData.findUser({email: req.body.email}).then(function(data) {
        if (data == null) {
          cryptoData.findUser({phone: req.body.phone, pwd: req.body.pwd}).then(function(result) {
            if (result) {
              cryptoData.updateUserInfo({
                phone: req.body.phone
              }, new_data).then(function(data) {
                console.log("update data: ", new_data);
                res.send(200, {result: "user Info update success"})
              })
            } else {
              res.send(400, {error: "Wrong user info"})
            }
          })
        }else{
          res.send(400, {error:"This email already registered."})
        }
      })
    } else {
      res.send(400, {error: "Wrong email or passwrod."})
    }

  });

  router.post("/updateStatus", checkPermission("admin"), function(req, res, next) {
    cryptoData.updateUserInfo({
      phone: req.body.phone
    }, {status: req.body.status}).then(function(data) {
      // console.log("update: ", data.result);
      res.send(200, {result: "status update success"})
    })
  });

  router.post("/delete", checkPermission("admin"), function(req, res, next) {
    const database = require("../data/database")

    database.deleteUser({phone: req.body.phone}).then(function(data) {
      console.log(data.result);
      res.send(200, data.result)
    })
  });

  return router;
}
