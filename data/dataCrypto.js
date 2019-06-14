
var database = require("./database")
var mycrypto = require('../lib/cryptoAlgorithms')


module.exports = {
  findUser: function(data){
    for(var n in data){
      data[n] = mycrypto.encrypt("SHA256", data[n]);
    }
    console.log(data);
    return database.findUser(data);
  },
  deleteUser: function(data){

    return database.deleteUser(data);
  },
  saveUser: function(data){
    data.email=mycrypto.encrypt("SHA256", data.email);
    data.pwd=mycrypto.encrypt("SHA256", data.pwd);
    console.log(data);
    return database.saveUser(data);
  },
  findUserId: function(data){

    return database.findUserId(data);
  },
  allUser: function(){
    return database.allUser();
  }

}
