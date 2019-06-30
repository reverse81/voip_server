module.exports = function (app) {
    var passportJWT = require('passport-jwt')
    var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        done(null, authData);
    });

    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = 'makefrommiya';

    function findUser(jwtPayload){}



    passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'pwd'
    },
    function(username, password, done){
      var database = require('../data/dataCrypto')
      var usercursur = database.findUser({
        email: username,
        pwd: password
        }).then(function(data){
          if(data !== null){
            var user = { id: username, phone:data.phone, permission: data.permission, status:data.status,message: "it makes from miya"};
            return done(null, user);
          }else{
            console.log("login error");
            return done(null, null);
          }
        }, function(err){
          console.log(err);
          return done(null, err);
        })
    }))

    passport.use(new JwtStrategy( opts, function (jwt_payload, done){
      var database = require('../data/dataCrypto')
      database.findUser({email: jwt_payload.id}).then(function(result){
        if(result){
          var user = {email:jwt_payload.id, permission: result.permission, status:result.status}
          return done(null, user);
        }else{
          return done(null, false)
        }
      })
    }
  ));

  return passport;
}
