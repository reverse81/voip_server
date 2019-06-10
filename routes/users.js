var express = require('express');
var router = express.Router();

var mongo = require("../data/database");
var cryptoData = require("../data/dataCrypto");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users', { title: 'User Management' });
});

router.get('/all', function(req, res, next){
  user_db = mongo.UserDB();
  var users = user_db.find({}).toArray(function(err, result){
    console.log(result);
    res.send(result);
  })
});

router.get('/ip', function(req, res, next){
  cryptoData.findUser({email:req.body.email}).then(function(data){
    res.send(data.ip);
  });
});

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
  })
})


router.post("/recovery", function(req, res, next){

})


router.post("/update", function(req, res, next){
  // user_db.findOneAndUpdate(obj, function(err,doc) {
  //        if (err) { throw err; }
  //        else { console.log("Updated"); }
  //      });
})


router.delete("/delete", function(req, res, next){

})

module.exports = router;
