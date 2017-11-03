var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

function localAuthenticate(User, rut, password, done) {
  User.findOneAsync({
    rut: rut.toLowerCase()
  })
    .then(function(user) {
      if (!user) {
        return done(null, false, {
          message: 'This rut is not registered.'
        });
      }
      user.authenticate(password, function(authError, authenticated) {
        if (authError) {
          return done(authError);
        }
        if (!authenticated) {
          return done(null, false, {
            message: 'This password is not correct.'
          });
        } else {
          return done(null, user);
        }
      });
    })
    .catch(function(err) {
      return done(err);
    });
}

exports.setup = function(User, config) {
  passport.use(new LocalStrategy({
    usernameField: 'rut',
    passwordField: 'password' // this is the virtual field on the model
  }, function(rut, password, done) {
    return localAuthenticate(User, rut, password, done);
  }));
};
