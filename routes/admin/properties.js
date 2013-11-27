var applications = require('../../lib/applications'),
    users = require('../../lib/users'),
    utils = require('../../lib/utils');

function create(req, res) {
    var appid = utils.toInteger(req.params.id);
    var entid = utils.toInteger(req.params.eid);
    res.render('admin/propertynew', { title: 'New Property', appid: appid, entid: entid, types: [ 'String', 'Text', 'Number' ] });
}

function insert(req, res) {
    var userid = users.getCurrentUserId(req);
    var appid = utils.toInteger(req.params.id);
    var entid = utils.toInteger(req.params.eid);
    
    var name = req.param('Name');
    
    var data = {
        Description: req.param('Description'),
        Type: req.param('Type'),
        IsDescription: utils.toBoolean(req.param('IsDescription')),
        InList: utils.toBoolean(req.param('InList'))
    };        var application;
    
    applications.getApplication(appid, process);
    
    function process(err, app) {
        if (err) {
            res.render('error', { title: 'Error', error: err });
            return;
        }
        
        if (!app || app.OwnerId !== userid) {
            res.render('error', { title: 'Error', error: 'Application not found' });
            return;
        }                application = app;                applications.createProperty(app, entid, name, data, process2);
    }
    
    function process2(err, prop) {
        if (err) {
            res.render('error', { title: 'Error', error: err });
            return;
        }                var ent = applications.getEntity(application, entid);
        
        res.render('admin/entityview', { title: 'Entity', appid: appid, item: ent });
    }
}

function edit(req, res) {
    var userid = users.getCurrentUserId(req);
    var appid = utils.toInteger(req.params.id);
    var entid = utils.toInteger(req.params.eid);
    var propid = utils.toInteger(req.params.pid);
    
    var application;
    
    applications.getApplication(appid, process);
    
    function process(err, app) {
        if (err) {
            res.render('error', { title: 'Error', error: err });
            return;
        }
        
        if (!app || app.OwnerId !== userid) {
            res.render('error', { title: 'Error', error: 'Application not found' });
            return;
        }
        
        application = app;
        
        applications.getProperty(app, entid, propid, process2);
    }
    
    function process2(err, prop) {
        if (err) {
            res.render('error', { title: 'Error', error: err });
            return;
        }
        
        var ent = applications.getEntity(application, entid);
        
        res.render('admin/propertyedit', { title: 'Edit Property', appid: appid, entid: entid, item: prop, types: [ 'String', 'Text', 'Number' ] });
    }
}

function update(req, res) {
    var userid = users.getCurrentUserId(req);
    var appid = utils.toInteger(req.params.id);
    var entid = utils.toInteger(req.params.eid);
    var propid = utils.toInteger(req.params.pid);
    
    var data = {
        Name: req.param('Name'),
        Description: req.param('Description'),
        Type: req.param('Type'),
        IsDescription: utils.toBoolean(req.param('IsDescription')),
        InList: utils.toBoolean(req.param('InList'))
    };
    
    var application;
    
    applications.getApplication(appid, process);
    
    function process(err, app) {
        if (err) {
            res.render('error', { title: 'Error', error: err });
            return;
        }
        
        if (!app || app.OwnerId !== userid) {
            res.render('error', { title: 'Error', error: 'Application not found' });
            return;
        }
        
        application = app;
        
        applications.updateProperty(app, entid, propid, data, process2);
    }
    
    function process2(err, prop) {
        if (err) {
            res.render('error', { title: 'Error', error: err });
            return;
        }
        
        var ent = applications.getEntity(application, entid);
        
        res.render('admin/entityview', { title: 'Entity', appid: appid, item: ent });
    }
}

function remove(req, res) {
    var userid = users.getCurrentUserId(req);
    var appid = utils.toInteger(req.params.id);
    var entid = utils.toInteger(req.params.eid);
    var propid = utils.toInteger(req.params.pid);
    
    var application;
    
    applications.getApplication(appid, process);
    
    function process(err, app) {
        if (err) {
            res.render('error', { title: 'Error', error: err });
            return;
        }
        
        if (!app || app.OwnerId !== userid) {
            res.render('error', { title: 'Error', error: 'Application not found' });
            return;
        }
        
        application = app;
        
        applications.removeProperty(app, entid, propid, process2);
    }
    
    function process2(err, prop) {
        if (err) {
            res.render('error', { title: 'Error', error: err });
            return;
        }
        
        var ent = applications.getEntity(application, entid);
        
        res.render('admin/entityview', { title: 'Entity', appid: appid, item: ent });
    }
}

module.exports = {
    create: create,
    insert: insert,
    edit: edit,
    update: update,
    remove: remove
}

