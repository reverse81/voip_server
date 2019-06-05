module.exports = function (app) {
    var passportJWT = require('passport-jwt')
    // var JwtStrategy = passportJWT.Strategy
    var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
    // var ExtractJwt = passportJWT.ExtractJwt;
    var users = require('./users')

    var authData = require('../password')[0]

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

    passport.use(new LocalStrategy({
            usernameField: 'id',
            passwordField: 'pwd'
        },
        function (username, password, done) {
          console.log("LocalStrategy");
          if(users.findUser(username)){
                if (password === users.findUser(username).password) {
                    return done(null, users.findUser(username), {
                        message: 'Welcome.'
                    });
                } else {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
            } else {
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
        }
    ));
    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = 'ilovecode';

    passport.use(new JwtStrategy( opts, function (jwt_payload, done){
      console.log("jwt Strategy");
      return done(null, authData)
    }
  ));

  return passport;
}
