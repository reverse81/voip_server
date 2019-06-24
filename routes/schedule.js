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
              return res.send("Unauthorized");
            }
          });
      }
  }

  var makePushMessageTCP = (ip) => {

  }

  var findParticipants = (participantsArray) => {
    var unable_user = []
    var enable_user = []
    for(var i=0; i< participantsArray.length; i++){
      database.findUser({phone: parseInt(participantsArray[i])}).then(function(result){
        if(result == null){
          unable_user.push(participantsArray[i])
        }
        else{
          enable_user.push(participantsArray[i])
        }
      })
    }
    return {enableUser: enable_user, unableUser: unable_user }
    /*
    1. 유저를 찾는다
    2. 스케쥴을 생성한다.
    3. push message를 보낸다?
    return {participants:[], unable_user:[]}
    */
  }

  var createSchedule = (schedule) => {

  }

  router.post('/create', checkPermission("users"), function (req, res, next) {
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
      "phoneNumber": "080"+  numGen.makeNumber(4) + numGen.makeNumber(4),
      "schedule":{
        "from": from,
        "to": to
      },
      "participants": participants,
      "expireAt": expire
    }
    //TODO: promise user find and push tcp after create schedule
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
      else{ res.send(404, "error")}
    })
  });

  router.get('/myschedule', checkPermission("users"), function (req, res, next) {
    var without = {_id:0, expireAt:0, participants:0}
    database.getSchedule({"participants":req.body.phone}, without).then(function(data){
      data.toArray(function(err, result){
        if(result){
          res.send(result);
        }
      });
    });
  });

  router.get('/IP', checkPermission("users"), function (req, res, next) {
    database.getOneSchedule({"phoneNumber":req.body.phone}).then(function(data){
      if(data){
        database.findUserIPs(data.participants).then(function(result){
          if(result) res.send(result);
          else res.send(404, "error")
        })
      }else{
        res.send(404, "not found")
      }
    });
  });

  return router;
}
