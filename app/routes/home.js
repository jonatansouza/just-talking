var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
module.exports = function(app) {
    var controller = app.controllers.home;

    app.get('/', controller.index);
    app.get('/chat', ensureLoggedIn('/login'), controller.chat);

};
