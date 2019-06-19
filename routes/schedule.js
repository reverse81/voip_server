var express = require('express');
var router = express.Router();
const session = require('express-session');
require('dotenv').config();
var jwt = require('jsonwebtoken');
var privatekey = process.env.SECRET_KEY;
var mycrypto = require("../lib/cryptoAlgorithms");
var database = require("../data/database")

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
    expire.setHours(expire.getHours()+1);
    var participants = req.body.participants.replace('\'','').split(',')

    var schedule = {
      "phone": conferenceCallNumber,
      "schedule":{
        "from": from,
        "to": to
      },
      "participants": participants,
      "expireAt": expire
    }
    //TODO: promise user find and push tcp after create schedule
    var unable_user = []
    for(var i=0; i< participants.length; i++){
      var item = participants[i]
      database.findUser({phone: parseInt(item)}).then(function(result){
        if(result == null){
          // res.send(`error. Can't find ${item}`)
          unable_user.push(item)
        }
      })
    }
    if(unable_user.length > 0){
      console.log(unable_user);
      res.send(`error. Can't find ${unable_user}`)
    }else{
      database.createSchedule(schedule).then(function(result){
        //TODO: push message to phone
          res.send(result)
      })
    }

  });

  router.get('/phone_number', checkPermission("users"), function (req, res, next) {

  });

  router.get('/members', checkPermission("users"), function (req, res, next) {

  });

  return router;
}
