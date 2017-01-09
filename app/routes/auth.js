var passport = require('passport');

module.exports = function(app){

    var controller = app.controllers.home;

    app.route('/login')
        .get(controller.login)
        .post(passport.authenticate('local', {
            successRedirect: '/chat',
            failureRedirect: '/login',
            failureFlash: true
        }));

    app.get('/logout', controller.logout);
    app.get('/signup', controller.signup);
    app.post('/signup', controller.saveUser);
    app.get('/free-user/:user', controller.checkUserFree);

};
