var express = require('express');
var router = express.Router();
const session = require('express-session');
require('dotenv').config();
var jwt = require('jsonwebtoken');
var privatekey = process.env.SECRET_KEY;
var mycrypto = require("../lib/cryptoAlgorithms");
var database = require("../data/database")
var numGen = require("../lib/numGenerator")
var tcp = require("../lib/socketApp")

module.exports = function (passport) {
  function checkPermission(permission) {
      return function(req,res,next) {
          return passport.authenticate('jwt',{ session: false })(req,res,function() {
            if(permission == req.user.permission){
                return next();
            }else if(permission == "all"){
              return next();
            }else{
              return res.send(404, {result:"Unauthorized"});
            }
          });
      }
  }

  router.post('/create', checkPermission("all"), function (req, res, next) {
    var conferenceCallNumber = parseInt(123)
    var from = new Date(req.body.from);
    var to = new Date(req.body.to);
    var expire = new Date(req.body.to);
    var now = new Date();
    var currentTimeZoneOffsetInHours = now.getTimezoneOffset() / 60;

    from.setHours(from.getHours()-currentTimeZoneOffsetInHours);
    to.setHours(to.getHours()-currentTimeZoneOffsetInHours);
    expire.setHours(expire.getHours()+1);

    var participants = req.body.participants.replace('\'','').replace(/(\s*)/g, '').split(',')

    var schedule = {
      "phoneNumber": "070"+  numGen.makeNumber(4) + numGen.makeNumber(4),
      "schedule":{
        "from": from,
        "to": to
      },
      "participants": participants,
      "expireAt": expire
    }

    database.findUserIPs(participants).then(function(result){
      if(result.length != participants.length){
        res.send(404, "user not founded.")
      }

      if(result.length > 1){
        for(var i in result){
          tcp.socket_client(result[i].ip, {phoneNumber:schedule.phoneNumber, schedule:schedule.schedule});
        }
      }else{
          tcp.socket_client(result[0].ip, {phoneNumber:schedule.phoneNumber, schedule:schedule.schedule});
      }

      if(result){
        database.createSchedule(schedule).then(function(result){
          if(result.ok){
            res.send(200, {phone:schedule.phoneNumber})
          }
          else{

          }
        })
      }
      else{ res.send(404, {result:"error"})}
    })
  });

  router.get('/myschedule', checkPermission("all"), function (req, res, next) {
    var without = {_id:0, expireAt:0, participants:0}
    database.getSchedule({"participants":req.body.phone}, without).then(function(data){
      data.toArray(function(err, result){
        if(result){
          res.send(result);
        }else{
          res.send(404, {result:"error"})
        }
      });
    });
  });

  router.get('/all', checkPermission("all"), function (req, res, next) {
    var without = {_id:0, expireAt:0 }
    database.getSchedule({}, without).then(function(data){
      data.toArray(function(err, result){
        if(result){
          res.send(result);
        }else{
          res.send(404, {result:"error"})
        }
      });
    });
  });

  router.get('/IP', checkPermission("all"), function (req, res, next) {
    database.getOneSchedule({"phoneNumber":req.body.phone}).then(function(data){
      if(data){
        database.findUserIPs(data.participants).then(function(result){
          if(result) res.send(result);
          else res.send(404, {result:"error"})
        })
      }else{
        res.send(404, {result:"can't found Conference Call number"})
      }
    });
  });

  return router;
}
