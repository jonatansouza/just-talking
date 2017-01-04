var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(app) {

    var User = app.models.user;

    function findById(id, fn) {
        User.findById(id, function(err, user) {
            return fn(err, user);
        });
    }

    function findByEmail(username, fn) {

        User.findOne({
                'username': username
            })
            .then(
                function(user) {
                    return fn(null, user);
                },
                function(error) {
                    return fn(error, null);
                });
    }

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        findById(id, function(err, user) {
            done(err, user);
        });
    });
    passport.use(new LocalStrategy(
        function(username, password, done) {
            findByEmail(username, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Usuario inválido!'
                    });
                }

                user.comparePassword(password, function(err, isMatch) {
                    if (!isMatch) {
                        return done(null, false, {
                            message: 'Usuario ou Senha inválida!'
                        });
                    } else {
                        return done(null, user);
                    }
                });
            });
        }
    ));

};
