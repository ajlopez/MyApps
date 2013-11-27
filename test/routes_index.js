
var applications = require('../lib/applications'),
    controller = require('../routes/index'),
    instances = require('../lib/instances'),
    utils = require('../lib/utils'),
    stores = require('../lib/stores');

var myapps = require('./applications.json');
applications.load(myapps);
var storename = instances.getStoreName(myapps['1'], myapps['1'].Entities[0]);
var myinsts = require('./customers.json');
var store = stores.getStore(storename);
store.load(myinsts);

exports['Get index'] = function (test) {
    test.async();
    var req = {
        session: {
            userId: 1
        }
    };
    
    var res = {
        render: function (view, model) {
            test.equal(view, 'index');
            test.ok(model);
            test.equal(model.title, 'My Apps');
            test.ok(model.items);
            test.ok(Array.isArray(model.items));
            test.ok(model.items.length);
            
            for (var n in model.items) {
                var item = model.items[n];
                test.equal(item.OwnerId, 1);
            }
            
            test.done();
        }
    }
    
    controller.index(req, res);
};

exports['Get application'] = function (test) {
    test.async();
    
    var req = {
        session: {
            userId: 1
        },
        params: {
            id: 1
        }
    }
    
    var res = {
        render: function (view, model) {
            test.equal(view, 'application');
            test.ok(model);
            test.equal(model.title, myapps['1'].Name);
            test.ok(model.item);
            test.equal(model.item.Id, myapps['1'].Id);
            test.equal(model.item.Name, myapps['1'].Name);
            test.equal(model.item.Description, myapps['1'].Description);
            test.ok(model.item.Entities);
            test.ok(Array.isArray(model.item.Entities));
            test.done();
        }
    }
    
    controller.application(req, res);
}

exports['Get entity'] = function (test) {
    test.async();
    
    var req = {
        session: {
            userId: 1
        },
        params: {
            id: 1,
            eid: 1
        }
    }
    
    var res = {
        render: function (view, model) {
            test.equal(view, 'entity');
            test.ok(model);
            test.equal(model.title, myapps['1'].Entities[0].PluralName);
            test.equal(model.appid, 1);
            test.equal(model.appname, 'My Company');
            test.ok(model.item);
            test.equal(model.item.Id, myapps['1'].Entities[0].Id);
            test.equal(model.item.Name, myapps['1'].Entities[0].Name);
            test.equal(model.item.PluralName, myapps['1'].Entities[0].PluralName);
            test.equal(model.item.Description, myapps['1'].Entities[0].Description);
            test.ok(model.instances);
            test.ok(Array.isArray(model.instances));
            test.ok(model.instances.length);
            test.ok(model.properties);
            test.ok(model.properties.length);
            test.ok(model.helper);
            test.equal(model.helper, utils.helper);
            test.done();
        }
    }
    
    controller.entity(req, res);
}
