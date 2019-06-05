

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
  UserDB: function(){
      return database.users;
  },
  SaveToUserDB: function (){

  },
  ScheculeDB: function(){
    return database.schedules;
  }
}
