
module.exports = function(app) {
    var controller = {};
    var User = app.models.user;
    controller.index = function(req, res) {
        res.render('index', {
            'user': req.user.username
        });
    };

    controller.login = function(req, res) {
        res.render('login/login', {
            message: req.flash('error')
        });
    };

    controller.logout = function(req, res) {
        req.logout();
        res.redirect('/');
    };

    controller.signup = function(req, res){
      res.render('login/signup');
    }

    controller.saveUser = function(req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;

        User.findOrCreate({
            'username': user.username
        }, user, function(err, user, create) {
            if (create) {
                user.save(function(err, user) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('created' + user);
                    }
                })
            }
            if (err) {
                console.log(err);
            }
        });
        res.redirect('/');
    };

    return controller;
};
