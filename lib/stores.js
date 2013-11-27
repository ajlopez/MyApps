
var utils = require('./utils');

var stores = { };

function MemoryStore(name) {
    var items = { };
    var maxid = 0;
    
    this.getName = function () { return name; }
    
    this.add = function (item, next) {
        item._id = ++maxid;
        items[item._id] = item;
        next(null, item);
    };
    
    this.save = function (item, next) {
        items[item._id] = item;
        next(null, item);
    };
    
    this.remove = function (id, next) {
        delete items[id];
        next(null, null);
    };
    
    this.getById = function (id, next) {
        if (items[id])
            next(null, items[id]);
        else
            next(null, null);
    };
    
    this.find = function (next) {
        var result = [];
        
        for (n in items) {
            var item = items[n];
            result.push(item);
        }
        
        next(null, result);
    };
    
    this.load = function (insts) {
        items = insts;
        
        maxid = 0;
        
        for (n in items) {
            var item = items[n];
            if (item._id > maxid)
                maxid = item._id;
        };
    }
}

function getStore(name) {
    if (!stores[name])
        stores[name] = new MemoryStore(name);

    return stores[name];
}

function removeStore(name, next) {
    delete stores[name];
    
    next(null, null);
}

module.exports = {
    getStore: getStore,
    removeStore: removeStore
};

