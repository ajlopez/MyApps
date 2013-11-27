
var applications = require('../lib/applications'),
    controller = require('../routes/instances'),
    instances = require('../lib/instances'),
    utils = require('../lib/utils'),
    stores = require('../lib/stores');

var myapps = require('./applications.json');
applications.load(myapps);
var storename = instances.getStoreName(myapps['1'], myapps['1'].Entities[0]);
var myinsts = utils.clone(require('./customers.json'));
var store = stores.getStore(storename);
store.load(myinsts);

exports['View instance'] = function (test) {
    test.async();
    
    var req = {
        session: {
            userId: 1
        },
        params: {
            id: 1,
            eid: 1,
            iid: 1
        }
    }
    
    var res = {
        render: function (view, model) {
            test.equal(view, 'instanceview');
            test.ok(model);
            test.equal(model.title, myapps['1'].Entities[0].Name);
            test.ok(model.properties);
            test.equal(model.appid, 1);
            test.equal(model.entid, 1);
            test.equal(model.appname, 'My Company');
            test.equal(model.entsetname, 'Customers');
            test.equal(model.entname, 'Customer');
            test.ok(Array.isArray(model.properties));
            test.ok(model.properties.length);
            test.ok(model.item);
            test.equal(model.item._id, 1);
            test.equal(model.item.name, "Customer 1");
            test.equal(model.item.address, "Address 1");
            test.equal(model.item.web_site, "http://customer1.com");
            test.ok(model.helper);
            test.equal(model.helper, utils.helper);
            test.done();
        }
    }
    
    controller.view(req, res);
}

exports['Create instance'] = function (test) {
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
            test.equal(view, 'instancenew');
            test.ok(model);
            test.equal(model.title, 'New ' + myapps['1'].Entities[0].Name);
            test.ok(model.properties);
            test.equal(model.appid, 1);
            test.equal(model.entid, 1);
            test.ok(Array.isArray(model.properties));
            test.ok(model.properties.length);
            test.done();
        }
    }
    
    controller.create(req, res);
}

exports['Insert instance'] = function (test) {
    test.async();
    
    var params = {
        name: 'New Customer',
        address: 'New Address',
        web_site: 'http://newcustomer.com'
    };
    
    var req = {
        session: {
            userId: 1
        },
        params: {
            id: 1,
            eid: 1
        },
        param: function (name) { return params[name] }
    }
    
    var newinst;
    
    var res = {
        render: function (view, model) {
            test.equal(view, 'instanceview');
            test.ok(model);
            test.equal(model.title, myapps['1'].Entities[0].Name);
            test.ok(model.properties);
            test.equal(model.appid, 1);
            test.equal(model.entid, 1);
            test.ok(model.item);
            test.ok(model.item._id);
            test.equal(model.item.address, 'New Address');
            test.equal(model.item.web_site, 'http://newcustomer.com');
            test.ok(model.helper);
            test.equal(model.helper, utils.helper);
            
            newinst = model.item;
            
            instances.getInstance(myapps['1'], myapps['1'].Entities[0], model.item._id, process);
        }
    }
    
    function process(err, inst) {
        test.equal(err, null);
        test.ok(inst);
        test.equal(inst._id, newinst._id);
        test.equal(inst.name, newinst.name);
        test.equal(inst.address, newinst.address);
        test.equal(inst.web_site, newinst.web_site);
        test.done();
    }
    
    controller.insert(req, res);
}

exports['Edit instance'] = function (test) {
    test.async();
    
    var req = {
        session: {
            userId: 1
        },
        params: {
            id: 1,
            eid: 1,
            iid: 1
        }
    }
    
    var res = {
        render: function (view, model) {
            test.equal(view, 'instanceedit');
            test.ok(model);
            test.equal(model.title, 'Edit ' + myapps['1'].Entities[0].Name);
            test.ok(model.properties);
            test.equal(model.appid, 1);
            test.equal(model.entid, 1);
            test.equal(model.appname, 'My Company');
            test.equal(model.entsetname, 'Customers');
            test.equal(model.entname, 'Customer');
            test.ok(Array.isArray(model.properties));
            test.ok(model.properties.length);
            test.ok(model.item);
            test.equal(model.item._id, 1);
            test.equal(model.item.name, "Customer 1");
            test.equal(model.item.address, "Address 1");
            test.equal(model.item.web_site, "http://customer1.com");
            test.done();
        }
    }
    
    controller.edit(req, res);
}

exports['Update instance'] = function (test) {
    test.async();
    
    var params = {
        name: 'Customer One',
        address: 'Address One',
        web_site: 'http://customerone.com'
    };
    
    var req = {
        session: {
            userId: 1
        },
        params: {
            id: 1,
            eid: 1,
            iid: 1
        },
        param: function (name) { return params[name] }
    }
    
    var instance;
    
    var res = {
        render: function (view, model) {
            test.equal(view, 'instanceview');
            test.ok(model);
            test.equal(model.title, myapps['1'].Entities[0].Name);
            test.ok(model.properties);
            test.equal(model.appid, 1);
            test.equal(model.entid, 1);
            test.equal(model.appname, 'My Company');
            test.equal(model.entsetname, 'Customers');
            test.equal(model.entname, 'Customer');
            test.ok(Array.isArray(model.properties));
            test.ok(model.properties.length);
            test.ok(model.item);
            test.equal(model.item._id, 1);
            test.equal(model.item.address, "Address One");
            test.equal(model.item.web_site, "http://customerone.com");
            test.ok(model.helper);
            test.equal(model.helper, utils.helper);
            
            instance = model.item;
            
            instances.getInstance(myapps['1'], myapps['1'].Entities[0], instance._id, process);
        }
    }
    
    function process(err, inst) {
        test.equal(err, null);
        test.ok(inst);
        test.equal(inst._id, instance._id);
        test.equal(inst.name, instance.name);
        test.equal(inst.address, instance.address);
        test.equal(inst.web_site, instance.web_site);
        test.done();
    }
    
    controller.update(req, res);
}

exports['Remove instance'] = function (test) {
    test.async();
    
    var req = {
        session: {
            userId: 1
        },
        params: {
            id: 1,
            eid: 1,
            iid: 1
        }
    }
    
    var instance;
    
    var res = {
        render: function (view, model) {
            test.equal(view, 'entity');
            test.ok(model);
            test.equal(model.title, myapps['1'].Entities[0].PluralName);
            test.equal(model.appid, 1);
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
            
            instances.getInstance(myapps['1'], myapps['1'].Entities[0], 1, process);
        }
    }
    
    function process(err, inst) {
        test.equal(err, null);
        test.equal(inst, null);
        test.done();
    }
    
    controller.remove(req, res);
}
