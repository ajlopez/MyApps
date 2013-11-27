
var applications = require('../lib/applications'),
    instances = require('../lib/instances'),
    stores = require('../lib/stores');
    
exports['Make instance'] = function (test) {
    var inst = instances.makeInstance([], { Name: 'Instance 1', Description: 'My Instance 1' });
    test.ok(inst);
    test.equal(inst.name, 'Instance 1');
    test.equal(inst.description, 'My Instance 1');
};

exports['Make instance with integer value'] = function (test) {
    var prop = { Name: 'Quantity', Type: 'Number' };
    var inst = instances.makeInstance([ prop ], { Name: 'Instance 1', Quantity: '100' });
    test.ok(inst);
    test.equal(inst.name, 'Instance 1');
    test.strictEqual(inst.quantity, 100);
};

exports['Get store name'] = function (test) {
    var app = { Id: 1, Name: 'My Application' };
    var ent = { Id: 2, Name: 'My Entity' };
    
    var name = instances.getStoreName(app, ent);
    
    test.ok(name);
    test.equal(name, 'my_application__1__my_entities');
};

exports['Create instance'] = function (test) {
    test.async();
    
    var appid = Math.floor(Math.random() * 100000);
    var app = { Id: appid, Name: 'My Application' };
    var ent = { Id: 3, Name: 'Customer', PluralName: 'Customers', Properties: [] };
    var data = { Name: 'Instance Name', Description: 'Instance Description' };
    
    instances.createInstance(app, ent, data, process);
    
    var newinst;
    
    function process(err, inst) {
        test.equal(err, null);
        test.ok(inst);
        test.ok(inst._id);
        test.equal(inst.name, 'Instance Name');
        test.equal(inst.description, 'Instance Description');
        newinst = inst;
        
        var store = stores.getStore(instances.getStoreName(app, ent));
        
        store.getById(inst._id, process2);
    }
    
    function process2(err, inst) {
        test.equal(err, null);
        test.ok(inst);
        test.equal(inst._id, newinst._id);
        test.equal(inst.name, newinst.name);
        test.equal(inst.description, newinst.description);
        test.done();
    }
};

