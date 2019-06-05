var express = require('express');
var router = express.Router();

var mongo = require("../lib/database");

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
  res.send("ip adress")
});

router.post('/ip', function(req, res, next){
  res.send("ip adress")
});

router.get('/create', function (request, res, next) {
  res.render('signup', { session:request.session });
});

router.post("/create", function(req, res, next){
  user_db = mongo.UserDB();
  var phone_number = parseInt(0701234567);
  user_db.find({email:{$eq: req.body.email}}).toArray(function(err, result){
    if(result.length > 0){
      res.send("already added.")
    }else{
      user_db.stats(function(err, result){
        user_db.find({}).toArray(function(err, re){
          next_id = re[result.count-1]._id+1;
          var myobj = {
            _id: next_id,
            email: req.body.email,
            pwd:req.body.pwd,
            phone: phone_number+ parseInt(next_id),
            ip: "0.0.0.0",
            permission: "users",
            status: "enable"};

          user_db.insertOne(myobj, function(err, result){
            if(err) throw err;
            console.log("inserted");
            res.send(myobj);
          })
        });
      })
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
