
var applications = require('../lib/applications'),
    controller = require('../routes/admin/properties'),
    users = require('../lib/users'),
    instances = require('../lib/instances'),
    utils = require('../lib/utils'),
    stores = require('../lib/stores');

var myapps = require('./applications.json');
applications.load(myapps);
var storename = instances.getStoreName(myapps['1'], myapps['1'].Entities[0]);
var myinsts = utils.clone(require('./customers.json'));
var store = stores.getStore(storename);
store.load(myinsts);

exports['New property'] = function (test) {
    test.async();
    
    var req = { 
        session: {
            userId: 1
        },
        params: {
            id: 1,
            eid: 1
        }
    };
    
    var res = {
        render: function (view, model) {
            test.ok(view);
            test.equal(view, 'admin/propertynew');
            test.ok(model);
            test.equal(model.title, 'New Property');
            test.equal(model.appid, 1);
            test.equal(model.entid, 1);
            test.ok(model.types);
            test.ok(Array.isArray(model.types));
            test.ok(model.types.indexOf('String') >= 0);
            test.ok(model.types.indexOf('Text') >= 0);
            test.ok(model.types.indexOf('Number') >= 0);
            test.done();
        }
    };
    
    controller.create(req, res);
};

exports['Insert property'] = function (test) {
    test.async();
    
    var params = {
        Name: 'New Property',
        Description: 'A New Property',
        Type: 'String',
        IsDescription: 'true',
        InList: 'true'
    }
    
    var req = {
        session: {
            userId: 1
        },
        params: {
            id: 1,
            eid: 1
        },
        param: function (name) { return params[name]; }
    }
    
    var res = {
        render: function (view, model) {
            test.equal(view, 'admin/entityview');
            test.ok(model);
            test.equal(model.title, 'Entity');
            test.ok(model.item);
            test.equal(model.appid, 1);
            test.equal(model.item.Id, 1);
            test.equal(model.item.Name, 'Customer');
            test.equal(model.item.Description, 'My Customers');
            test.ok(model.item.Properties);
            test.ok(Array.isArray(model.item.Properties));
            test.ok(model.item.Properties.length);
            var l = model.item.Properties.length - 1;
            test.ok(model.item.Properties[l].Id);
            test.equal(model.item.Properties[l].Name, 'New Property');
            test.equal(model.item.Properties[l].Description, 'A New Property');
            test.equal(model.item.Properties[l].Type, 'String');
            test.strictEqual(model.item.Properties[l].IsDescription, true);
            test.strictEqual(model.item.Properties[l].InList, true);
            test.done();
        }
    }
    
    controller.insert(req, res);
};

exports['Edit property'] = function (test) {
    test.async();
    
    var req = {
        session: {
            userId: 1
        },
        params: {
            id: 1,
            eid: 1,
            pid: 1
        }
    }
    
    var res = {
        render: function (view, model) {
            test.equal(view, 'admin/propertyedit');
            test.ok(model);
            test.equal(model.title, 'Edit Property');
            test.ok(model.item);
            test.equal(model.appid, 1);
            test.equal(model.entid, 1);
            
            test.ok(model.item);
            test.equal(model.item.Id, 1);
            test.equal(model.item.Name, 'Name');
            test.equal(model.item.Type, 'String');
            
            test.ok(model.types);
            test.ok(Array.isArray(model.types));
            test.ok(model.types.indexOf('String') >= 0);
            test.ok(model.types.indexOf('Text') >= 0);
            test.ok(model.types.indexOf('Number') >= 0);
            
            test.done();
        }
    }
    
    controller.edit(req, res);
};

exports['Update property'] = function (test) {
    test.async();
    
    var params = {
        Name: 'New Name',
        Description: 'New Description',
        Type: 'String',
        IsDescription: 'false',
        InList: 'false'
    };
    
    var req = {
        session: {
            userId: 1
        },
        params: {
            id: 1,
            eid: 1,
            pid: 1
        },
        param: function (name) { return params[name]; }
    }
    
    var res = {
        render: function (view, model) {
            test.equal(view, 'admin/entityview');
            test.ok(model);
            test.equal(model.title, 'Entity');
            test.ok(model.item);
            test.equal(model.appid, 1);
            test.equal(model.item.Id, 1);
            test.equal(model.item.Name, 'Customer');
            test.equal(model.item.Description, 'My Customers');
            test.ok(model.item.Properties);
            test.ok(Array.isArray(model.item.Properties));
            test.ok(model.item.Properties.length);
            test.ok(model.item.Properties[0].Id);
            test.equal(model.item.Properties[0].Name, 'New Name');
            test.equal(model.item.Properties[0].Description, 'New Description');
            test.equal(model.item.Properties[0].Type, 'String');
            test.strictEqual(model.item.Properties[0].IsDescription, false);
            test.strictEqual(model.item.Properties[0].InList, false);
            test.done();
        }
    }
    
    controller.update(req, res);
};

exports['Remove property'] = function (test) {
    test.async();
    
    var req = {
        session: {
            userId: 1
        },
        params: {
            id: 2,
            eid: 1,
            pid: 1
        }
    }
    
    var res = {
        render: function (view, model) {
            test.equal(view, 'admin/entityview');
            test.ok(model);
            test.equal(model.title, 'Entity');
            test.ok(model.item);
            test.equal(model.appid, 2);
            test.equal(model.item.Id, 1);
            test.equal(model.item.Name, 'City');
            test.ok(model.item.Properties);
            test.ok(Array.isArray(model.item.Properties));
            test.equal(model.item.Properties.length, 0);
            test.done();
        }
    }
    
    controller.remove(req, res);
};
