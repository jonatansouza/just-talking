var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
module.exports = function(app) {
    var controller = app.controllers.home;

    app.get('/', ensureLoggedIn('/login'), controller.index);

};
