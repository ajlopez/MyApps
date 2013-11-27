
var applications = require('../../lib/applications'),
    utils = require('../../lib/utils'),
    users = require('../../lib/users');

function index(req, res) {
    var userid = users.getCurrentUserId(req);
    applications.getApplicationsByOwnerId(userid, process);
    
    function process(err, apps) {
        if (err) {
            res.render('error', { error: err });
            return;
        }
        
        var model = {
            title: 'Applications',
            items: apps
        };
        
        res.render('admin/applicationlist', model);
    }
}

function create(req, res) {
    res.render('admin/applicationnew', { title: 'New Application' });
}

function insert(req, res) {
    var userid = users.getCurrentUserId(req);
    var name = req.param('Name');
    var data = {
        Description: req.param('Description'),
        IsPublic: utils.toBoolean(req.param('IsPublic')),
        OwnerId: userid
    }
    
    applications.createApplication(name, data, process);
    
    function process(err, app) {
        if (err) {
            res.render('error', { error: err });
            return;
        }
        
        var model = {
            title: 'Application',
            item: app
        }
        
        res.render('admin/applicationview', model);
    }
}

function view(req, res) {
    var userid = users.getCurrentUserId(req);
    applications.getApplication(utils.toInteger(req.params.id), process);
    
    function process(err, app) {
        if (err) {
            res.render('error', { title: 'Error', error: err });
            return;
        }
        
        if (!app || app.OwnerId !== userid) {
            res.render('error', { title: 'Error', error: 'Application not found' });
            return;
        }
        
        var model = {
            title: 'Application',
            item: app
        }
        
        res.render('admin/applicationview', model);
    }
}

function edit(req, res) {
    var userid = users.getCurrentUserId(req);
    applications.getApplication(utils.toInteger(req.params.id), process);
    
    function process(err, app) {
        if (err) {
            res.render('error', { title: 'Error', error: err });
            return;
        }
        
        if (!app || app.OwnerId !== userid) {
            res.render('error', { title: 'Error', error: 'Application not found' });
            return;
        }
        
        var model = {
            title: 'Edit Application',
            item: app
        }
        
        res.render('admin/applicationedit', model);
    }
}

function update(req, res) {
    var userid = users.getCurrentUserId(req);
    var appid = utils.toInteger(req.params.id);

    var data = {
        Description: req.param('Description'),
        IsPublic: utils.toBoolean(req.param('IsPublic'))
    }

    applications.updateApplication(appid, userid, data, process);
    
    function process(err, app) {
        if (err) {
            res.render('error', { title: 'Error', error: err });
            return;
        }

        var model = {
            title: 'Application',
            item: app
        }
        
        res.render('admin/applicationview', model);
    }
}

module.exports = {
    index: index,
    create: create,
    insert: insert,
    view: view,
    edit: edit,
    update: update
}

