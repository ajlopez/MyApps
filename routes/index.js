
var applications = require('../lib/applications'),
    instances = require('../lib/instances'),
    utils = require('../lib/utils'),
    users = require('../lib/users');
    
exports.index = function(req, res){
    console.dir(req.session);
    userid = users.getCurrentUserId(req);
    
    applications.getApplicationsByOwnerId(userid, function (err, apps) {
        if (err)
            return utils.error(res, err);
        
        res.render('index', { title: 'My Apps', items: apps });
    });
};

exports.login = function(req, res) {
    res.render('login', { title: 'Login' });
};

exports.logout = function(req, res) {
    delete req.session.userId;
    res.redirect('/');
};

exports.dologin = function(req, res) {
    var username = req.param('username');
    var password = req.param('password');
    
    if (username)
        username = username.trim();
        
    if (password)
        password = password.trim();
        
    if (!username) {
        res.render('login', { title: 'Login', error: 'Username is required', error2: '' });
        return;
    }
        
    if (!password) {
        res.render('login', { title: 'Login', error: 'Password is required', error2: '' });
        return;
    }

    var user = users.retrieveUser(username, password);
    
    if (!user) {
        res.render('login', { title: 'Login', error: 'Invalid username or password', error2: '' });
        return;
    }
    
    req.session.userId = user.Id;
    
    res.redirect('/');
};

exports.register = function(req, res) {
    console.log('register');
    var username = req.param('username');
    var password = req.param('password');
    
    if (username)
        username = username.trim();
        
    if (password)
        password = password.trim();
        
    if (!username) {
        console.log('user');
        res.render('login', { title: 'Login', error2: 'Username is required', error: '' });
        return;
    }
        
    if (!password) {
        console.log('password');
        res.render('login', { title: 'Login', error2: 'Password is required', error: '' });
        return;
    }

    if (users.userExists(username, password)) {
        console.log('exists');
        res.render('login', { title: 'Login', error2: 'User already exists', error: '' });
        return;
    }
    
    var user = users.addUser(username, password);
    
    req.session.userId = user.Id;
    
    console.log('redirect');
    
    res.redirect('/');
};

exports.login = function(req, res) {
    res.render('login', { title: 'Login' });
};

exports.application = function (req, res) {
    userid = users.getCurrentUserId(req);
    appid = utils.toInteger(req.params.id);

    applications.getApplication(appid, process);
    
    function process(err, app) {
        if (err)
            return utils.error(res, err);
        
        if (!app || app.OwnerId != userid)
            return utils.error(res, 'Application not found');
        
        res.render('application', { title: app.Name, item: app });
    }
};

exports.entity = function (req, res) {
    userid = users.getCurrentUserId(req);
    appid = utils.toInteger(req.params.id);
    entid = utils.toInteger(req.params.eid);

    applications.getApplication(appid, process);

    var application;
    var entity;
    
    function process(err, app) {
        if (err)
            return utils.error(res, err);
        
        if (!app || app.OwnerId != userid)
            return utils.error(res, 'Application not found');
        
        application = app;
        
        var ent = applications.getEntity(app, entid);
        
        if (!ent)
                return utils.error(res, 'Entity not found');
            
        entity = ent;
        
        instances.getInstances(application, entity, process2);
    }

    function process2(err, insts) {
        if (err)
            return utils.error(res, err);
        
        var properties = [];
        
        entity.Properties.forEach(function (property) {
            if (!property.InList)
                return;
                
            var prop = {
                Name: utils.normalize(property.Name),
                Title: property.Name
            };
            
            properties.push(prop);
        });
        
        res.render('entity', { title: entity.PluralName, appid: appid, appname: application.Name, item: entity, instances: insts, properties: properties, helper: utils.helper });
    }
}

