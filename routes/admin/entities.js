
var applications = require('../../lib/applications'),
    users = require('../../lib/users');

function create(req, res) {
    var appid = toInteger(req.params.id);
    res.render('admin/entitynew', { title: 'New Entity', appid: appid });
}

function insert(req, res) {
    var appid = toInteger(req.params.id);
    var name = req.param('Name');
    var data = { 
        Description: req.param('Description'),
        PluralName: req.param('PluralName')
    };    
    
    applications.getApplication(appid, process);
    
    function process(err, app) {
        if (err) {
            res.render('error', { error: err });
            return;
        }
        
        applications.createEntity(app, name, data, process2);
    }
    
    function process2(err, ent) {
        if (err) {
            res.render('error', { error: err });
            return;
        }
        
        res.render('admin/entityview', { title: 'Entity', item: ent, appid: appid });
    }
}

function view(req, res) {
    var userid = users.getCurrentUserId(req);
    var appid = toInteger(req.params.id);
    var entid = toInteger(req.params.eid);
    
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
        
        var ent = applications.getEntity(app, entid);
        
        if (!ent) {
            res.render('error', { title: 'Error',  error: 'Entity not found' });
            return;
        }
        
        res.render('admin/entityview', { title: 'Entity', item: ent, appid: appid });
    }
}

function edit(req, res) {
    var userid = users.getCurrentUserId(req);
    var appid = toInteger(req.params.id);
    var entid = toInteger(req.params.eid);
    
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
        
        var ent = applications.getEntity(app, entid);
        
        if (!ent) {
            res.render('error', { title: 'Error',  error: 'Entity not found' });
            return;
        }
        
        res.render('admin/entityedit', { title: 'Edit Entity', item: ent, appid: appid });
    }
}

function update(req, res) {
    var userid = users.getCurrentUserId(req);
    var appid = toInteger(req.params.id);
    var entid = toInteger(req.params.eid);
    
    var data = {
        Description: req.param('Description'),
        PluralName: req.param('PluralName')
    };
    
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
        
        applications.updateEntity(app, entid, data, process2);
    }
    
    function process2(err, ent) {
        if (err) {
            res.render('error', { title: 'Error', error: err });
            return;
        }
        
        if (!ent) {
            res.render('error', { title: 'Error',  error: 'Entity not found' });
            return;
        }
        
        res.render('admin/entityview', { title: 'Entity', item: ent, appid: appid });
    }
}

function toInteger(value) {
    if (typeof value === 'string')
        return parseInt(value);
        
    return value;
}

module.exports = {
    create: create,
    insert: insert,
    view: view,
    edit: edit,
    update: update
}
