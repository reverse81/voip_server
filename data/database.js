

var mongoClient = require('mongodb').MongoClient;

var database = {
  "users": null,
  "schedules": null
};
//{ "_id" : "rid@naver.com", "email" : "rid@naver.com", "pwd" : "1234", "phone" : "010-1234-5678", "ip" : "0.0.0.1" }

module.exports = {
  connectDB: function(){
      var databaseURL = 'mongodb://127.0.0.1:27017/VoIP';
      mongoClient.connect(databaseURL,
          function (err, cluster)
          {
              if (err) {
                  console.log('db connect error');
                  return;
              }
              console.log('db was connected : ' + databaseURL);
              var temp = cluster.db("VoIP");
              database.users = temp.collection('users');
              database.schedules = temp.collection('schedules');
              const collection = cluster.db("VoIP").collection("users");
          }
      );
  },
  findUser: function(data){
    return new Promise(function (resolve, reject){
      database.users.findOne(data, function(err, result){
        if(err) throw err;
        resolve(result);
      })
    })
  },

  deleteUser: function(data){
    database.users.deleteOne(data, function(err, result){
      if(err) throw err;
      console.log("deleted");
    });
  },
  saveUser: function(data){
    return new Promise(function (resolve, reject){
      database.users.insertOne(data, function(err, result){
        if(err) throw err;
        console.log("inserted");
        resolve(result);
      })
    })

  },
  findUserId: function(data){
    return new Promise(function (resolve, reject){
      database.users.stats(function(err, result){
        database.users.find({}).toArray(function(err, re){
          next_id = re[result.count-1]._id+1;
          resolve(next_id);
        })
      })
    })
  },
  updateUser: function(email, data){
    database.users.findOneAndUpdate(email, data)
  },
  allUser: function(){
    return new Promise(function (resolve, reject){
      database.users.find({}, function(err, result){
        if(err) throw err;
        resolve(result);
      })
    })
  }

}
