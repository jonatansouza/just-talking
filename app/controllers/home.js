module.exports = function(app) {
    var controller = {};
    var User = app.models.user;

    controller.getUser = function(req, res) {
        User.findOne({
            'username': req.params.user
        }, function(err, user) {
            console.log(user);
            if (user) {
                res.render('users/profile', {
                    user: user
                });
            } else {
                res.status(500);
            }
        });

    }

    controller.index = function(req, res) {
        res.render('index');
    }

    controller.chat = function(req, res) {
        res.render('chat', {
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

    controller.signup = function(req, res) {
        res.render('login/signup', {
            message: req.flash('error')
        });
    }

    controller.checkUserFree = function(req, res) {
        User.findOne({
            'username': req.params.user
        }, function(err, user) {
            if (user) {
                res.json({
                    status: true
                });
            } else {
                res.json({
                    status: false
                });
            }
        });

    }

    controller.saveUser = function(req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err, user) {
            if (err) {
                console.log(err);
            } else {
                console.log(user);
                res.json({
                    status: 'ok',
                    user: user
                });
            }
        });
        /*User.findOrCreate({
            'username': user.username
        }, user, function(err, user, create) {
            console.log(create);
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
                res.render('login/signup', {
                    message: err.ValidationError
                });
            }
        });
        //res.redirect('/');*/
    };

    return controller;
};
