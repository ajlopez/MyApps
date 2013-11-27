
var applications = require('../lib/applications'),
    controller = require('../routes/admin/entities'),
    users = require('../lib/users');
    
var app;
exports['New entity'] = function (test) {
    test.async();
    
    getApplication(process);
    
    function process(err, app) {
        test.equal(err, null);
        test.ok(app);
        
        var req = { 
            params: {
                id: app.Id
            }
        };
        
        var res = {
            render: function (view, model) {
                test.ok(view);
                test.equal(view, 'admin/entitynew');
                test.ok(model);
                test.equal(model.title, 'New Entity');
                test.equal(model.appid, app.Id);
                test.done();
            }
        };
        
        controller.create(req, res);
    }
};

exports['Insert entity'] = function (test) {
    test.async();
    
    test.equal(app.Entities.length, 0);
    
    var params = {
        Name: 'New Entity',
        Description: 'My New Entity',
    }
    
    var req = { 
        params: {
            id: app.Id
        },
        param: function (name) { return params[name]; }
    };
    
    var res = {
        render: function (view, model) {
            test.ok(view);
            test.equal(view, 'admin/entityview');
            test.ok(model);
            test.equal(model.title, 'Entity');
            test.equal(model.appid, app.Id);
            test.ok(model.item);
            test.ok(model.item.Id);
            test.equal(model.item.ApplicationId, app.Id);
            test.equal(model.item.Name, 'New Entity');
            test.equal(model.item.PluralName, 'New Entities');
            test.equal(model.item.Description, 'My New Entity');
            test.ok(app.Entities);
            test.equal(app.Entities.length, 1);
            test.equal(app.Entities[0].Name, 'New Entity');
            test.equal(app.Entities[0].PluralName, 'New Entities');
            test.equal(app.Entities[0].ApplicationId, app.Id);
            test.done();
        }
    };
    
    controller.insert(req, res);
};

exports['View entity'] = function (test) {
    test.async();
    
    var req = { 
        session: {
            userId: 1
        },
        params: {
            id: app.Id,
            eid: app.Entities[0].Id
        }
    };
    
    var res = {
        render: function (view, model) {
            test.ok(view);
            test.equal(view, 'admin/entityview');
            test.ok(model);
            test.equal(model.title, 'Entity');
            test.equal(model.appid, app.Id);
            test.ok(model.item);
            test.ok(model.item.Id);
            test.equal(model.item.ApplicationId, app.Id);
            test.equal(model.item.Name, 'New Entity');
            test.equal(model.item.Description, 'My New Entity');
        }
    };
    
    controller.view(req, res);
};

        session: {
            userId: 1
        },
        session: {
            userId: 1
        },
function getApplication(next) {
    if (app) {
        next(null, app);
        return;
    }
    
    applications.createApplication('New Test Application', { Description: 'New Test Application', OwnerId: 1 }, 
        function (err, newapp) {
            if (err) {
                next(err, null);
                return;
            }
            
            app = newapp;
            
            next(null, newapp);
        });
}