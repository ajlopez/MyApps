
var applications = require('../lib/applications'),
    controller = require('../routes/admin/applications'),
    users = require('../lib/users');
    
exports['Get index'] = function (test) {
    test.async();
    
    var req = { 
        session: {
            userId: 1
        }
    };
    var res = {
        render: function (view, model) {
            test.ok(view);
            test.equal(view, 'admin/applicationlist');
            test.ok(model);
            test.equal(model.title, 'Applications');
            test.ok(model.items);
            test.ok(Array.isArray(model.items));
            test.done();
        }
    };
    
    controller.index(req, res);
};

exports['New application'] = function (test) {
    test.async();
    
    var req = { };
    var res = {
        render: function (view, model) {
            test.ok(view);
            test.equal(view, 'admin/applicationnew');
            test.ok(model);
            test.equal(model.title, 'New Application');
            test.done();
        }
    };
    
    controller.create(req, res);
};

var newid;

exports['Insert application'] = function (test) {
    test.async();
    var params = {
        Name: 'New Application',
        Description: 'My New Application',
        IsPublic: 'true'
    };
    
    var req = {
        session: {
            userId: 1
        },
        param: function (name) {
            return params[name]
        }
    };

    var res = {
        render: function (view, model) {
            test.ok(view);
            test.equal(view, 'admin/applicationview');
            test.ok(model);
            test.equal(model.title, 'Application');
            test.ok(model.item);
            test.ok(model.item.Id);
            newid = model.item.Id;
            test.equal(model.item.Name, 'New Application');
            test.equal(model.item.Description, 'My New Application');
            test.strictEqual(model.item.IsPublic, true);
            test.ok(model.item.OwnerId);
            test.equal(model.item.OwnerId, users.getCurrentUserId(req));
            
            applications.getApplication(model.item.Id, process);
        }
    };
    
    controller.insert(req, res);
    
    function process(err, app) {
        test.equal(err, null);
        test.ok(app);
        test.equal(app.Name, 'New Application');
        test.equal(app.Description, 'My New Application');
        test.ok(app.Id);
        test.ok(app.OwnerId);
        test.done();
    }
};

exports['View application'] = function (test) {
    test.async();
    
    var req = {
        session: {
            userId: 1
        },
        params: {
            id: newid
        }
    };

    var res = {
        render: function (view, model) {
            test.ok(view);
            test.equal(view, 'admin/applicationview');
            test.ok(model);
            test.equal(model.title, 'Application');
            test.ok(model.item);
            test.ok(model.item.Id);
            test.equal(model.item.Id, newid);
            test.equal(model.item.Name, 'New Application');
            test.equal(model.item.Description, 'My New Application');
            test.ok(model.item.OwnerId);
            test.equal(model.item.OwnerId, users.getCurrentUserId(req));
            test.done();
        }
    };
    
    controller.view(req, res);
};

exports['Edit application'] = function (test) {
    test.async();
    
    var req = {
        session: {
            userId: 1
        },
        params: {
            id: newid
        }
    };

    var res = {
        render: function (view, model) {
            test.ok(view);
            test.equal(view, 'admin/applicationedit');
            test.ok(model);
            test.equal(model.title, 'Edit Application');
            test.ok(model.item);
            test.ok(model.item.Id);
            test.equal(model.item.Id, newid);
            test.equal(model.item.Name, 'New Application');
            test.equal(model.item.Description, 'My New Application');
            test.ok(model.item.OwnerId);
            test.equal(model.item.OwnerId, users.getCurrentUserId(req));
            test.done();
        }
    };
    
    controller.edit(req, res);
};

exports['Update application'] = function (test) {
    test.async();
    
    var params = {
        Description: 'New Description',
        IsPublic: 'false'
    }
    
    var req = {
        session: {
            userId: 1
        },
        param: function (name) { return params[name]; },
        params: {
            id: newid
        }
    };

    var res = {
        render: function (view, model) {
            test.ok(view);
            test.equal(view, 'admin/applicationview');
            test.ok(model);
            test.equal(model.title, 'Application');
            test.ok(model.item);
            test.ok(model.item.Id);
            test.equal(model.item.Id, newid);
            test.equal(model.item.Name, 'New Application');
            test.equal(model.item.Description, 'New Description');
            test.strictEqual(model.item.IsPublic, false);
            test.ok(model.item.OwnerId);
            test.equal(model.item.OwnerId, users.getCurrentUserId(req));
            test.done();
        }
    };
    
    controller.update(req, res);
};
