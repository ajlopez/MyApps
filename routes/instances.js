
var applications = require('../lib/applications'),
    instances = require('../lib/instances'),
    utils = require('../lib/utils'),
    users = require('../lib/users');

exports.view = function(req, res) {
    var userid = users.getCurrentUserId(req);
    var appid = utils.toInteger(req.params.id);
    var entid = utils.toInteger(req.params.eid);
    var instid = utils.toInteger(req.params.iid);
    
    applications.getApplication(appid, process);
    
    var application;
    var entity;
    
    function process(err, app) {
        if (err)
            return utils.error(res, err);
            
        if (!app || app.OwnerId !== userid)
            return utils.error(res, 'Application not found');
            
        var ent = applications.getEntity(app, entid);
        
        application = app;
        entity = ent;
        
        instances.getInstance(app, ent, instid, process2);
    }
    
    function process2(err, inst) {
        if (err)
            return utils.error(res, err);
            
        var properties = [];
        
        entity.Properties.forEach(function (property) {
            properties.push( { Name: utils.normalize(property.Name), Title: property.Name });
        });
            
        res.render('instanceview', { title: entity.Name, appid: appid, entid: entid, appname: application.Name, entname: entity.Name, entsetname: entity.PluralName, item: inst, properties: properties, helper: utils.helper });
    }
};

exports.create = function(req, res) {
    var userid = users.getCurrentUserId(req);
    var appid = utils.toInteger(req.params.id);
    var entid = utils.toInteger(req.params.eid);
    
    applications.getApplication(appid, process);
    
    var application;
    var entity;
    
    function process(err, app) {
        if (err)
            return utils.error(res, err);
            
        if (!app || app.OwnerId !== userid)
            return utils.error(res, 'Application not found');
            
        var ent = applications.getEntity(app, entid);
        
        application = app;
        entity = ent;

        var properties = [];
        
        entity.Properties.forEach(function (property) {
            properties.push( { Name: utils.normalize(property.Name), Title: property.Name, Type: property.Type, Reference: property.Reference });
        });
            
        res.render('instancenew', { title: 'New ' + entity.Name, appid: appid, appname: application.Name, entname: entity.Name, entsetname: entity.PluralName, entid: entid, properties: properties });
    }
};

exports.insert = function(req, res) {
    var userid = users.getCurrentUserId(req);
    var appid = utils.toInteger(req.params.id);
    var entid = utils.toInteger(req.params.eid);
    
    applications.getApplication(appid, process);
    
    var application;
    var entity;
    
    function process(err, app) {
        if (err)
            return utils.error(res, err);
            
        if (!app || app.OwnerId !== userid)
            return utils.error(res, 'Application not found');
            
        var ent = applications.getEntity(app, entid);
        
        application = app;
        entity = ent;
        
        var data = { };
        
        entity.Properties.forEach(function (property) {
            var name = utils.normalize(property.Name);
            data[name] = req.param(name);
        });
        
        instances.createInstance(application, entity, data, process2);
    }
    
    function process2(err, inst) {
        if (err)
            return utils.error(res, err);
            
        var properties = [];
        
        entity.Properties.forEach(function (property) {
            properties.push( { Name: utils.normalize(property.Name), Title: property.Name });
        });
            
        res.render('instanceview', { title: entity.Name, appid: appid, appname: application.Name, entname: entity.Name, entsetname: entity.PluralName, entid: entid, properties: properties, item: inst, helper: utils.helper });
    }
};

exports.edit = function(req, res) {
    var userid = users.getCurrentUserId(req);
    var appid = utils.toInteger(req.params.id);
    var entid = utils.toInteger(req.params.eid);
    var instid = utils.toInteger(req.params.iid);
    
    applications.getApplication(appid, process);
    
    var application;
    var entity;
    
    function process(err, app) {
        if (err)
            return utils.error(res, err);
            
        if (!app || app.OwnerId !== userid)
            return utils.error(res, 'Application not found');
            
        var ent = applications.getEntity(app, entid);
        
        application = app;
        entity = ent;
        
        instances.getInstance(app, ent, instid, process2);
    }
    
    function process2(err, inst) {
        if (err)
            return utils.error(res, err);
            
        var properties = [];
        
        entity.Properties.forEach(function (property) {
            properties.push( { Name: utils.normalize(property.Name), Title: property.Name });
        });
            
        res.render('instanceedit', { title: 'Edit ' + entity.Name, appid: appid, entid: entid, appname: application.Name, entname: entity.Name, entsetname: entity.PluralName, item: inst, properties: properties });
    }
};

exports.update = function(req, res) {
    var userid = users.getCurrentUserId(req);
    var appid = utils.toInteger(req.params.id);
    var entid = utils.toInteger(req.params.eid);
    var instid = utils.toInteger(req.params.iid);
    
    applications.getApplication(appid, process);
    
    var application;
    var entity;
    
    function process(err, app) {
        if (err)
            return utils.error(res, err);
            
        if (!app || app.OwnerId !== userid)
            return utils.error(res, 'Application not found');
            
        var ent = applications.getEntity(app, entid);
        
        application = app;
        entity = ent;
        
        var data = { };
        
        entity.Properties.forEach(function (property) {
            var name = utils.normalize(property.Name);
            data[name] = req.param(name);
        });
        
        instances.updateInstance(application, entity, instid, data, process2);
    }
    
    function process2(err, inst) {
        if (err)
            return utils.error(res, err);
            
        var properties = [];
        
        entity.Properties.forEach(function (property) {
            properties.push( { Name: utils.normalize(property.Name), Title: property.Name });
        });
            
        res.render('instanceview', { title: entity.Name, appid: appid, appname: application.Name, entname: entity.Name, entsetname: entity.PluralName, entid: entid, properties: properties, item: inst, helper: utils.helper });
    }
};

exports.remove = function(req, res) {
    var userid = users.getCurrentUserId(req);
    var appid = utils.toInteger(req.params.id);
    var entid = utils.toInteger(req.params.eid);
    var instid = utils.toInteger(req.params.iid);
    
    applications.getApplication(appid, process);
    
    var application;
    var entity;
    
    function process(err, app) {
        if (err)
            return utils.error(res, err);
            
        if (!app || app.OwnerId !== userid)
            return utils.error(res, 'Application not found');
            
        var ent = applications.getEntity(app, entid);
        
        application = app;
        entity = ent;
        
        instances.removeInstance(application, entity, instid, process2);
    }
    
    function process2(err, inst) {
        if (err)
            return utils.error(res, err);
            
        instances.getInstances(application, entity, process3);
    }
    
    function process3(err, insts) {
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
        
        res.render('entity', { title: entity.PluralName, appid: appid, item: entity, instances: insts, properties: properties, helper: utils.helper });
    }
};
