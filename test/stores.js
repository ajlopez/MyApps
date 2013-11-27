
var stores = require('../lib/stores'),
    utils = require('../lib/utils');
    
var customers = utils.clone(require('./customers.json'));

exports['Create store'] = function (test) {
    var store = stores.getStore('test');
    
    test.ok(store);
    test.equal(store.getName(), 'test');
};

exports['Get store'] = function (test) {
    var store = stores.getStore('test');
    var store2 = stores.getStore('test');
    
    test.ok(store);
    test.strictEqual(store, store2);
};

exports['Get unknown item by id'] = function (test) {
    test.async();

    var store = stores.getStore('test');
    
    store.getById(1, process);
    
    function process(err, item) {
        test.equal(err, null);
        test.equal(item, null);
        test.done();
    }
}

exports['Get item by id'] = function (test) {
    test.async();
    
    var store = stores.getStore('test');
    
    var item = { Name: 'My Trip', Destination: 'Buenos Aires' };
    
    store.add(item, process);
    
    function process(err, item) {
        test.equal(err, null);
        test.ok(item);
        test.ok(item._id);
        test.equal(item.Name, 'My Trip');
        test.equal(item.Destination, 'Buenos Aires');
        
        store.getById(item._id, process2);
    }
    
    function process(err, newitem) {
        test.equal(err, null);
        test.ok(newitem);
        test.ok(newitem._id);
        test.equal(newitem._id, item._id);
        test.equal(newitem.Name, item.Name);
        test.equal(newitem.Destination, item.Destination);
        test.done();
    }
}

exports['Get second item by id'] = function (test) {
    test.async();
    
    var store = stores.getStore('test');
    
    var item = { Name: 'My Trip', Destination: 'New York' };
    
    store.add(item, process);
    
    function process(err, item) {
        test.equal(err, null);
        test.ok(item);
        test.ok(item._id);
        test.equal(item.Name, 'My Trip');
        test.equal(item.Destination, 'New York');
        
        store.getById(item._id, process2);
    }
    
    function process(err, newitem) {
        test.equal(err, null);
        test.ok(newitem);
        test.ok(newitem._id);
        test.equal(newitem._id, item._id);
        test.equal(newitem.Name, item.Name);
        test.equal(newitem.Destination, item.Destination);
        test.done();
    }
}

exports['Find items'] = function (test) {
    test.async();
    
    var store = stores.getStore('test');
    
    store.find(process);
    
    function process(err, items) {
        test.equal(err, null);
        test.ok(items);
        test.ok(Array.isArray(items));
        test.ok(items.length >= 2);
        
        for (var k = 0; k < items.length; k++) {
            var item = items[k];
            
            test.ok(item._id);
            test.equal(item.Name, 'My Trip');
            test.ok(item.Destination);
        }
        
        test.done();
    }
}

exports['Load and find items'] = function (test) {
    test.async();
    
    var store = stores.getStore('store1');
    store.load(utils.clone(customers));
    
    store.find(process);
    
    function process(err, items) {
        test.equal(err, null);
        test.ok(items);
        test.ok(Array.isArray(items));
        test.ok(items.length);
        
        for (var k = 0; k < items.length; k++) {
            var item = items[k];
            
            test.ok(item._id);
            test.ok(item.name);
        }
        
        test.done();
    }
}

exports['Load, retrieve and save items'] = function (test) {
    test.async();
    
    var store = stores.getStore('store2');
    store.load(utils.clone(customers));
    
    store.getById(1, process);
    
    function process(err, item) {
        test.equal(err, null);
        test.ok(item);
        test.equal(item._id, 1);
        
        item.name = 'New Name';
        
        store.save(item, process2);
    }
    
    function process2(err, item) {
        test.equal(err, null);
        test.ok(item);
        
        store.getById(1, process3);
    }
    
    function process2(err, item) {
        test.equal(err, null);
        test.ok(item);
        test.equal(item.name, 'New Name');
        
        test.done();
    }
}

exports['Remove item'] = function (test) {
    test.async();
    
    var store = stores.getStore('store3');
    store.load(utils.clone(customers));
    
    store.remove(1, process);
    
    function process(err, data) {
        test.equal(err, null);
        
        store.getById(1, process2);
    }
    
    function process2(err, item) {
        test.equal(err, null);
        test.equal(item, null);
        
        test.done();
    }
}

exports['Remove store'] = function (test) {
    test.async();
    
    var store = stores.getStore('store4');
    store.load(utils.clone(customers));
    
    stores.removeStore('store4', process);
    
    function process(err, data) {
        test.equal(err, null);
        
        store = stores.getStore('store4');
        
        store.find(process2);
    }
    
    function process2(err, items) {
        test.equal(err, null);
        test.ok(items);
        test.equal(items.length, 0);
        
        test.done();
    }
}
