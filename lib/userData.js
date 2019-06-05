
var mongo = require("./lib/database");

var user = () => {
  var usercursur = user_db.mongo.find({
    email: request.body.email,
    pwd: request.body.pwd
  })
  .toArray(function(err, result){
    if(result.length == 0){
      console.log("not found");
      res.send(404)
    }else{
      // console.log(result.toArray());
      var user = { id: request.body.email };
      var token = jwt.sign(user, 'ilovecode');
      console.log(user, token);
      res.cookie('user', token);

      res.send({"endpoint": "/users"});
    }
  })
}


module.exports = {
    get: function() {
        return null;
    }
}
