
var database = require("./database")
var mycrypto = require('../lib/cryptoAlgorithms')


module.exports = {
  findUser: function(data){
    for(var n in data){
      if (n == "email" || n== "pwd"){
        data[n] = mycrypto.encrypt("SHA256", data[n]);
      }
    }
    return database.findUser(data);
  },
  deleteUser: function(data){
    return database.deleteUser(data);
  },
  updatePwd:function(phone, pwd){
    pwd = mycrypto.encrypt("SHA256", pwd)
    return database.updateUsers(phone, {pwd:pwd})
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
  findUserIP: function(data){
    return database.findUser(data);
  },
  updateUserInfo:function(filter, data){
    for(var n in filter){
      if (n == "email" || n== "pwd"){
        filter[n] = mycrypto.encrypt("SHA256", filter[n]);
      }
    }
    for(var n in data){
      if (n == "email" || n== "pwd"){
        data[n] = mycrypto.encrypt("SHA256", data[n]);
      }
    }
    return database.updateUsers(filter, data);
  },
  allUser: function(){
    return database.allUser();
  }
}
