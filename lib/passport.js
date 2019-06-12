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

    function findUser(jwtPayload){

    }

    passport.use(new JwtStrategy( opts, function (jwt_payload, done){
      return done(null, jwt_payload.id, {message:"okok"});

    }
  ));
//   passport.use(new JwtStrategy({
//         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//         secretOrKey   : 'makefrommiya'
//     },
//     function (jwtPayload, cb) {
//         //find the user in db if needed
//         var user = jwtPayload.email;
//         return cb(null, user);
//         // return UserModel.findOneById(jwtPayload.id)
//         //     .then(user => {
//         //         return cb(null, user);
//         //     })
//         //     .catch(err => {
//         //         return cb(err);
//         //     });
//     }
// ));

  return passport;
}
