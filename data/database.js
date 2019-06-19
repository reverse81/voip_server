

var mongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;

var database = {
  "users": null,
  "schedules": null
};
//{ "_id" : "rid@naver.com", "email" : "rid@naver.com", "pwd" : "1234", "phone" : "010-1234-5678", "ip" : "0.0.0.1" }
//mongodb+srv://miheui:<password>@cluster0-bwbkf.mongodb.net/test?retryWrites=true&w=majorityl
module.exports = {
  connectDB: function(){
      var databaseURL = MONGO_URI;
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
    return new Promise(function (resolve, reject){
      database.users.deleteOne(data,{w: 1}, function(err, result){
        if(err) throw err;
        console.log("deleted");
        resolve(result);
      });
    })
  },
  saveUser: function(data){
    return new Promise(function (resolve, reject){
      database.users.insertOne(data, {w: 1}, function(err, result){
        if(err) throw err;
        console.log("inserted");
        resolve(result.result);
      })
    })

  },
  findUserId: function(data){
    return new Promise(function (resolve, reject){
      database.users.stats(function(err, result){
        if(result.count == 0){
          resolve(0);
        }else{
          database.users.find({}).toArray(function(err, re){
            next_id = re[result.count-1]._id+1;
            resolve(next_id);
          })
        }
      })
    })
  },
  findUserIP: function(data){
    return new Promise(function (resolve, reject){
      database.users.findOne(data, function(err, result){
        if(err) throw err;
        resolve(result);
      })
    })
  },
  updateUsers:function(filter, data){
    return new Promise(function (resolve, reject){
      console.log("update", data);
      database.users.updateOne(filter, {$set: data}, function(err,doc) {
       if (err) { throw err; }
       else { console.log("Updated"); resolve(doc)}
     });
    })
  },
  allUser: function(){
    return new Promise(function (resolve, reject){
      database.users.find({}, function(err, result){
        if(err) throw err;
        resolve(result);
      })
    })
  },
  createSchedule:function(data){
    return new Promise(function (resolve, reject){
      database.schedules.createIndex( { "expireAt": 1 }, { expireAfterSeconds: 0 } )
      database.schedules.insertOne(data, {w: 1}, function(err, result){
        if(err) throw err;
        console.log("inserted");
        resolve(result.result);
      })
    })
  }

}
