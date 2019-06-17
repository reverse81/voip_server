
var database = require("./database")
var mycrypto = require('../lib/cryptoAlgorithms')


module.exports = {
  findUser: function(data){
    console.log("findUser", data);
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
  updatePwd:function(email, pwd){
    email.email = mycrypto.encrypt("SHA256", email.email)
    pwd = mycrypto.encrypt("SHA256", pwd)
    return database.updateUser(email, pwd)
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
